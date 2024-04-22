import { CheckIcon, Select } from "native-base";


const CustomPersonRelationDropDown = ({ selectedVillage, selectItems, accessibilityLabel, placeholder, selctedValue }) => {

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
            {selectItems.map((item, index) => (
                <Select.Item
                    key={`value-key-${index}`}
                    label={item.value}
                    value={item.key}
                />
            ))}
        </Select>
    )
}

export default CustomPersonRelationDropDown;