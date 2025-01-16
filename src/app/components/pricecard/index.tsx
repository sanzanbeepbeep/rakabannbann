import React from 'react';
import { Card } from 'antd';




export default function CardHouse() {
    return (
        <Card
        title=""
        style={{ width: 300 }}
        >
            <p>House</p>
            <p>Lat</p>
            <p>Long</p>
            <p>Area</p>
            <p>Price</p>
        </Card>
    );
}