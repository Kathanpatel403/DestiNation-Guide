import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const TypingEffect = ({ text, onFinishTyping }) => {
  const [displayText, setDisplayText] = useState([]);

  useEffect(() => {
    let index = 0;

    const typingInterval = setInterval(() => {
      const letter = text[index];
      const color = getLetterColor(index, text);

      setDisplayText((prevText) => [...prevText, { letter, color }]);

      index += 1;

      if (index === text.length) {
        clearInterval(typingInterval);
        onFinishTyping();
      }
    }, 61); // Adjust the typing speed as needed

    return () => clearInterval(typingInterval);
  }, [text, onFinishTyping]);

  const getLetterColor = (index, text) => {
    // Assign colors based on the words in the text
    const destiColor = "#000"; //'#FF9933'; // Saffron
    const nationColor = "#000"; //'#FFFFFF'; // White
    const guideColor = "#000"; //'#138808'; // Green

    // Check the current word and assign color accordingly
    if (text.includes("Desti") && index < 5) {
      return destiColor;
    } else if (text.includes("Nation") && index >= 5 && index < 12) {
      return nationColor;
    } else if (text.includes("Guide") && index >= 12) {
      return guideColor;
    }

    // Default color
    return destiColor;
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {displayText.map((item, index) => (
        <Text
          key={index}
          style={{ color: item.color, fontSize: 45, marginTop: -60 }}
        >
          {item.letter}
        </Text>
      ))}
    </View>
  );
};

export default TypingEffect;