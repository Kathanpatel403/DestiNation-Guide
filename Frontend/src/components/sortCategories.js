import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { sortCategoryData } from '../constants';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function SortCategories() {
  const [activeSort, setActiveSort] = useState('All');

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: wp(4),
        backgroundColor: '#f0f0f0',
        borderRadius: wp(5),
        borderWidth: 1,
        borderColor: '#dbdbdb',
        paddingVertical: wp(2),
        paddingHorizontal: wp(4),
        spaceBetween: wp(2),
      }}
    >
      {sortCategoryData.map((sort, index) => {
        let isActive = sort === activeSort;
        let activeButtonStyle = isActive
          ? { backgroundColor: '#d1d5db', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8 }
          : {};

        return (
          <TouchableOpacity
            onPress={() => setActiveSort(sort)}
            key={index}
            style={{
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: wp(3.5),
              borderRadius: wp(5),
              ...activeButtonStyle,
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                fontWeight: '600',
                color: isActive ? '#000000' : '#000000',
              }}
            >
              {sort}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
