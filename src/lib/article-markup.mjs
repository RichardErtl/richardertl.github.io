// Markdown processor plugin. Shapes rendered articles into the markup the design system styles:
// TL;DR callout, scrollable tables with numeric columns, focusable code blocks,
// and figures with captions.
import { readFileSync } from 'node:fs';

const isElement = (node, tag) => node?.type === 'element' && node.tagName === tag;
const isBlank = (node) => node?.type === 'text' && !node.value.trim();
const onlyChild = (node) => {
  const kids = node.children.filter((kid) => !isBlank(kid));
  return kids.length === 1 ? kids[0] : undefined;
};

/** Reads intrinsic size from an SVG in public/, so the lazy image reserves its space. */
function svgSize(src) {
  if (!src.startsWith('/') || !src.endsWith('.svg')) return {};
  const svg = readFileSync(new URL(`../../public${src}`, import.meta.url), 'utf8');
  const [, width, height] = svg.match(/<svg[^>]*\swidth="(\d+)"[^>]*\sheight="(\d+)"/) ?? [];
  return width ? { width, height } : {};
}

function shapeCallout(node, ctx) {
  const first = node.children.find((kid) => !isBlank(kid));
  const lead = first?.children?.find((kid) => !isBlank(kid));
  if (!isElement(lead, 'strong') || !ctx.textContent(lead).startsWith('TL;DR')) return;
  ctx.setField(node, 'tagName', 'aside');
  ctx.setProperty(node, 'className', ['tldr']);
}

function shapeCell(node, ctx) {
  if (node.tagName === 'th') ctx.setProperty(node, 'scope', 'col');
  if (/text-align:\s*right/.test(String(node.properties.style ?? ''))) {
    ctx.setProperty(node, 'className', ['num']);
  }
  ctx.setProperty(node, 'style', undefined);
}

/** Turns an image paragraph, plus an italic paragraph after it, into a figure. */
function shapeFigure(node, ctx) {
  const image = onlyChild(node);
  if (!isElement(image, 'img')) return;

  const siblings = ctx.parent(node).children;
  let next = ctx.indexOf(node) + 1;
  while (isBlank(siblings[next])) next++;
  const captionNode = isElement(siblings[next], 'p') ? siblings[next] : undefined;
  const caption = captionNode && onlyChild(captionNode);
  const hasCaption = isElement(caption, 'em');

  const properties = { ...image.properties, ...svgSize(String(image.properties.src)), loading: 'lazy' };
  const children = [{ type: 'element', tagName: 'img', properties, children: [] }];
  if (hasCaption) {
    children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [caption] });
    ctx.removeNode(captionNode);
  }
  ctx.replaceNode(node, { type: 'element', tagName: 'figure', properties: {}, children });
}

/** Counts the columns of a table from its first row. */
function columnCount(node) {
  const row = (function firstRow(parent) {
    for (const kid of parent.children ?? []) {
      if (isElement(kid, 'tr')) return kid;
      const found = firstRow(kid);
      if (found) return found;
    }
  })(node);
  return row?.children.filter((kid) => isElement(kid, 'th') || isElement(kid, 'td')).length ?? 0;
}

/** Only tables wider than two columns can scroll, so only those take keyboard focus. */
function shapeTable(node, ctx) {
  const scrollable = columnCount(node) > 2;
  ctx.wrapNode(node, {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['tablewrap'],
      ...(scrollable && { tabIndex: 0, role: 'region', ariaLabel: 'Scrollable table' }),
    },
    children: [],
  });
}

function shapeCode(node, ctx) {
  ctx.setProperty(node, 'tabIndex', 0);
  ctx.setProperty(node, 'role', 'region');
  ctx.setProperty(node, 'ariaLabel', 'Code block');
}

export const articleMarkup = {
  name: 'article-markup',
  element: {
    filter: ['blockquote', 'p', 'pre', 'table', 'td', 'th'],
    visit(node, ctx) {
      if (node.tagName === 'blockquote') shapeCallout(node, ctx);
      else if (node.tagName === 'p') shapeFigure(node, ctx);
      else if (node.tagName === 'pre') shapeCode(node, ctx);
      else if (node.tagName === 'table') shapeTable(node, ctx);
      else shapeCell(node, ctx);
    },
  },
};
