import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.scss'
import logoPromobit from '../../../assets/logo_promobit.png'

export function Header() {

   return (
      <header className={styles.main}>
         <Link href="/">
            <div className={styles.logoContainer}>
               <Image
                  height={50}
                  objectFit={'scale-down'}
                  src={logoPromobit}
                  alt="Site Logo"
               >
               </Image>
            </div>
         </Link>
      </header>
   )
}