import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CheckIcon, Select } from "native-base"
import { useState } from "react";
import { useTranslation } from "react-i18next";


const CustomPersonStatusDropdown = ({ selectedVillage, accessibilityLabel, placeholder, selctedValue }) => {

    const { t } = useTranslation();

    const initialLabel = t('maritalstatus');
    const married = t('married');
    const unmarried = t('unmarried');
    const widower = t('widower');
    const widow = t('widow');
    const divorcee = t('divorcee');
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

            {/*  <Select.Item
                label={initialLabel}
                value="maritalstatus"
                disabled
            /> */}
            <Select.Item
                label={married}
                value="Married"
            />
            <Select.Item
                label={unmarried}
                value="Unmarried"
            />
            <Select.Item
                label={widower}
                value="widower"
            />
            <Select.Item
                label={widow}
                value="Widow"
            />
            <Select.Item
                label={divorcee}
                value="Divorcee"
            />

        </Select>
    )
}

export default CustomPersonStatusDropdown;
