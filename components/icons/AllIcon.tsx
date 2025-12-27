import React from 'react';
import Svg, { Text } from 'react-native-svg';

const AllIcon = (props: any) => (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
        <Text
            x="12"
            y="16"
            fontSize="9"
            fontWeight="bold"
            fill="currentColor"
            textAnchor="middle"
        >
            ALL
        </Text>
    </Svg>
);

export default AllIcon;
