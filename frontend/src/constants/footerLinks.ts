export interface IFooterLinks {
  title: string
  links: Array<{ label: string; href: string }>
}

export const footerLinks: Array<IFooterLinks> = [
  {
    title: 'Help',
    links: [
      {
        label: 'Benellit Discounts',
        href: '#f',
      },
      {
        label: 'Discount API',
        href: '#s',
      },
    ],
  },
  {
    title: 'Solutions',
    links: [
      {
        label: 'Newsletter',
        href: '#ff',
      },
      {
        label: 'SaaS Business',
        href: '#ss',
      },
      {
        label: 'Online Courses',
        href: '#zz',
      },
    ],
  },
  {
    title: 'Features',
    links: [
      {
        label: 'Benellit Discounts',
        href: '#c',
      },
    ],
  },
  {
    title: 'Tools',
    links: [
      {
        label: 'Salary Converter',
        href: '#d',
      },
    ],
  },
  {
    title: 'Company',
    links: [
      {
        label: 'Affiliate',
        href: '#e',
      },
      {
        label: 'Twitter',
        href: '#g',
      },
      {
        label: 'Terms of Service',
        href: '#h',
      },
    ],
  },
] as const
export default footerLinks
