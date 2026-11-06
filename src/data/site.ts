// Figures, links and contact details shown on the site. Change them here.

/** False while SITE_URL is unset: the build then carries noindex and a disallow-all robots.txt. */
export const isPublicBuild = !import.meta.env.SITE?.startsWith('http://localhost');

export const site = {
  name: 'Richard Ertl',
  headline: 'Building and optimizing agentic software engineering systems',
  description:
    'I design, run, and measure systems that coordinate AI coding agents on real software, with humans in control.',

  principle: 'If we are no longer the ones writing the code, why are we still using a coding interface?',

  quote: {
    text: 'Preserve what the agent knows, constrain what it must write, and generate what the successor needs to see.',
    articleId: 'why-i-stopped-maintaining-shared-state',
  },

  results: [
    {
      value: '29.7%',
      label: 'lower worker startup overhead',
      scope: '8,628 tokens per spawn. Median, 82 spawns before vs. 28 after, August 2026.',
    },
    {
      value: '33,877 to 20,020',
      label: 'characters of handover text before the first work step',
      scope: 'Median on one machine. Scope and limits in the case study.',
      articleId: 'why-i-stopped-maintaining-shared-state',
    },
  ],

  figures: {
    sessions: '1,400+',
    spans: '350,000+',
    asOf: 'As of November 2026',
  },

  links: {
    github: 'https://github.com/RichardErtl',
    linkedin: 'https://www.linkedin.com/in/richard-ertl-524b80208',
    publication: 'https://doi.org/10.3390/app16136704',
  },

  contact: {
    email: 'richard.ertl.mail@gmail.com',
  },
};
