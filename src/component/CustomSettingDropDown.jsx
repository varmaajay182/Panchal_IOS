import { CheckIcon, Select } from "native-base";

const CustomLanguageDropdown = ({ selectedLanguage, accessibilityLabel, placeholder, selctedValue }) => {
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
            selectedValue={selectedLanguage}
            onValueChange={(value) => {
                selctedValue(value || "")
            }}
            boxSize={3}
        >
            <Select.Item
                label="English"
                value="en"
            />
            <Select.Item
                label="ગુજરાતી"
                value="gu"
            />
        </Select>
    )
}

export default CustomLanguageDropdown;
