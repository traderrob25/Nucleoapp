'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavItem.module.css'

interface NavItemProps {
  href: string
  label: string
  locked?: boolean
}

export function NavItem({ href, label, locked = false }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  if (locked) {
    return (
      <div className={`${styles.item} ${styles.locked}`} aria-disabled="true">
        <span>{label}</span>
        <span className={styles.lockMark} aria-hidden />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={`${styles.item} ${isActive ? styles.active : ''}`}
    >
      {label}
    </Link>
  )
}
