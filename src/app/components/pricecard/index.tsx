import React from 'react';
import { Card } from 'antd';
import clsx from 'clsx';

export interface HouseProps {
    lat: string;
    long: string;
    area: string;
    price: string;
}

export interface CardHouseProps {
    data: HouseProps;
    isDarkMode: boolean;
}


export default function CardHouse({data,isDarkMode}: CardHouseProps) {
    return (
        <Card
        title=""
        className={clsx
            ('w-full',
                {
                    "!border-black": !isDarkMode,
                    "!border-white": isDarkMode,
                }
            )
        }
        >
            <div className='flex justify-between '>
                <p>Latitude</p>
                <p>{data.lat}</p>
            </div>
            <div className='flex justify-between'>
                <p>Longitude</p>
                <p>{data.long}</p>
            </div>
            <div className='flex justify-between'>
                <p>Area</p>
                <p>{data.area}</p>
            </div>
            <div className='flex justify-between'>
                <p>Price</p>
                <p>{data.price}</p>
            </div>
        </Card>
    );
}