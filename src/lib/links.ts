import type { AnchorHTMLAttributes } from 'react'
import type { ContactLink } from '../data/portfolio'

type ExternalLinkProps = Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'rel' | 'target'>

export function getExternalLinkProps(link: ContactLink): ExternalLinkProps {
  if (link.type === 'email' || link.download) {
    return {}
  }

  return {
    rel: 'noreferrer',
    target: '_blank',
  }
}
