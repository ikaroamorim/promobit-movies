import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.scss'
import logoPromobit from '../../../assets/logo_promobit.png'

export function Header() {

   return (
      <header className={styles.main}>
         <Link href="/" passHref>
            <div className={styles.logoContainer}>
               <Image
                  width={276}
                  height={50}
                  objectFit={'contain'}
                  src={logoPromobit}
                  alt="Site Logo"
               >
               </Image>
            </div>
         </Link>
      </header>
   )
}