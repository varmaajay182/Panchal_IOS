import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CheckIcon, Select } from "native-base"
import { useState } from "react";


const CustomDropDown = ({ selectedVillage, selectItems, accessibilityLabel, placeholder, selctedValue }) => {
    /*  const [selectedVillage, setSelectedVillage] = useState(null);
     console.log(selectedVillage, ":::selectedVillage") */
    console.log(selectItems[0]?._id, " ::::selectedVillage")
    return (
        <Select
            borderWidth={0}
            accessibilityLabel={accessibilityLabel}
            placeholder={placeholder}
            size={'lg'}
            _selectedItem={{
                bg: "blue.300",
                endIcon: <CheckIcon size="5" />,
            }}
            selectedValue={selectedVillage}
            onValueChange={(value) => {
                selctedValue(value || "")
            }}
            boxSize={3}
        >
            {selectItems.map((value, index) => (
                <Select.Item
                    key={`value-key-${index}`}
                    label={value.village}
                    value={value._id}
                />
            ))}
        </Select>
    )
}

export default CustomDropDown;