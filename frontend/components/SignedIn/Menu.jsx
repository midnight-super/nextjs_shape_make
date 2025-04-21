
import React from 'react'
import Link from 'next/link'
import { Icon } from '@chakra-ui/react';
export const MenuItem = ({ item, linkClassName }) => {
    return (
      <li className={'menu-item'}>
        <MenuItemLink item={item} className={linkClassName} />
      </li>
    );
  };
  
 export const MenuItemLink = ({ item, className }) => {
    return (
      <Link
        href={item.href??''}
        className={`side-nav-link-ref ${className}`}
      >
        {item.icon && (
          <span className='menu-icon'>
            <Icon
                  mr="4"
                  color={"gray.600"}
                  fontSize="16"
                  _groupHover={{
                    color: "white",
                  }}
                  as={item.icon}
                />
          </span>
        )}
        <span className='menu-text'>{item.name}</span>
      </Link>
    )
  }