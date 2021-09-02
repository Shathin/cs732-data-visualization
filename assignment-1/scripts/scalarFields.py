#

# ! CONSTANT_NAME = (column key, columns name, unit)

# * Data Set Columns

TOTAL_PARTICLE_DENSITY = {
    "fieldType": "given",
    "accessor": 0,
    "label": "Total Particle Density",
    "unit": "# particles / cm^3",
    "colorMap": "BuPu_r",
}
GAS_TEMPERATURE = {
    "fieldType": "given",
    "accessor": 1,
    "label": "Gas Temperature",
    "unit": "Kelvin",
    "colorMap": "hot_r",
}
H_MASS_ABUNDANCE = {
    "fieldType": "given",
    "accessor": 2,
    "label": "H Mass Adundance",
    "unit": "",
}
H_PLUS_MASS_ABUNDANCE = {
    "fieldType": "given",
    "accessor": 3,
    "label": "H+ Mass Adundance",
    "unit": "",
}
HE_MASS_ABUNDANCE = {
    "fieldType": "given",
    "accessor": 4,
    "label": "He Mass Adundance",
    "unit": "",
}
HE_PLUS_MASS_ABUNDANCE = {
    "fieldType": "given",
    "accessor": 5,
    "label": "He+ Mass Adundance",
    "unit": "",
}
HE_PLUS_PLUS_MASS_ABUNDANCE = {
    "fieldType": "given",
    "accessor": 6,
    "label": "He++ Mass Adundance",
    "unit": "",
}
H_MINUS_MASS_ABUNDANCE = {
    "fieldType": "given",
    "accessor": 7,
    "label": "H- Mass Adundance",
    "unit": "",
}
H2_MASS_ABUNDANCE = {
    "fieldType": "given",
    "accessor": 8,
    "label": "H2 Mass Adundance",
    "unit": "",
}
H2_PLUS_MASS_ABUNDANCE = {
    "fieldType": "given",
    "accessor": 9,
    "label": "H2 Mass Adundance",
    "unit": "",
}

# * Derived Columns

TOTAL_DENSITY = {
    "fieldType": "derived",
    "accessor": 10,
    "label": "Total Density",
    "unit": "g / cm^3",
    "colorMap": "BuPu_r",
}

H_NUMBER_DENSITY = {
    "fieldType": "derived",
    "accessor": 11,
    "label": "H Number Density",
    "unit": "# particles / cm^3",
    "type": "number_density",
    "dependentColumn": H_MASS_ABUNDANCE,
}

H_MASS_DENSITY = {
    "fieldType": "derived",
    "accessor": 12,
    "label": "H Mass Density",
    "unit": "g / cm^3",
    "type": "mass_density",
    "dependentColumn": H_MASS_ABUNDANCE,
}

H_PLUS_NUMBER_DENSITY = {
    "fieldType": "derived",
    "accessor": 13,
    "label": "H+ Number Density",
    "unit": "# particles / cm^3",
    "type": "number_density",
    "dependentColumn": H_PLUS_MASS_ABUNDANCE,
    "colorMap": "Reds",
}

H_PLUS_MASS_DENSITY = {
    "fieldType": "derived",
    "accessor": 14,
    "label": "H+ Mass Density",
    "unit": "g / cm^3",
    "type": "mass_density",
    "dependentColumn": H_PLUS_MASS_ABUNDANCE,
    "colorMap": "Oranges",
}

HE_NUMBER_DENSITY = {
    "fieldType": "derived",
    "accessor": 15,
    "label": "He Number Density",
    "unit": "# particles / cm^3",
    "type": "number_density",
    "dependentColumn": HE_MASS_ABUNDANCE,
}

HE_MASS_DENSITY = {
    "fieldType": "derived",
    "accessor": 16,
    "label": "He Mass Density",
    "unit": "g / cm^3",
    "type": "mass_density",
    "dependentColumn": HE_MASS_ABUNDANCE,
}

HE_PLUS_NUMBER_DENSITY = {
    "fieldType": "derived",
    "accessor": 17,
    "label": "He+ Number Density",
    "unit": "# particles / cm^3",
    "type": "number_density",
    "dependentColumn": HE_PLUS_MASS_ABUNDANCE,
    "colorMap": "Oranges",
}

HE_PLUS_MASS_DENSITY = {
    "fieldType": "derived",
    "accessor": 18,
    "label": "He+ Mass Density",
    "unit": "g / cm^3",
    "type": "mass_density",
    "dependentColumn": HE_PLUS_MASS_ABUNDANCE,
    "colorMap": "Oranges",
}

HE_PLUS_PLUS_NUMBER_DENSITY = {
    "fieldType": "derived",
    "accessor": 19,
    "label": "He++ Number Density",
    "unit": "# particles / cm^3",
    "type": "number_density",
    "dependentColumn": HE_PLUS_PLUS_MASS_ABUNDANCE,
    "colorMap": "Reds",
}

HE_PLUS_PLUS_MASS_DENSITY = {
    "fieldType": "derived",
    "accessor": 20,
    "label": "He++ Mass Density",
    "unit": "g / cm^3",
    "type": "mass_density",
    "dependentColumn": HE_PLUS_PLUS_MASS_ABUNDANCE,
    "colorMap": "Reds",
}

H_MINUS_NUMBER_DENSITY = {
    "fieldType": "derived",
    "accessor": 21,
    "label": "H- Number Density",
    "unit": "# particles / cm^3",
    "type": "number_density",
    "dependentColumn": H_MINUS_MASS_ABUNDANCE,
    "colorMap": "Greens_r",
}

H_MINUS_MASS_DENSITY = {
    "fieldType": "derived",
    "accessor": 22,
    "label": "H- Mass Density",
    "unit": "g / cm^3",
    "type": "mass_density",
    "dependentColumn": H_MINUS_MASS_ABUNDANCE,
}

H2_NUMBER_DENSITY = {
    "fieldType": "derived",
    "accessor": 23,
    "label": "H2 Number Density",
    "unit": "# particles / cm^3",
    "type": "number_density",
    "dependentColumn": H2_MASS_ABUNDANCE,
}

H2_MASS_DENSITY = {
    "fieldType": "derived",
    "accessor": 24,
    "label": "H2 Mass Density",
    "unit": "g / cm^3",
    "type": "mass_density",
    "dependentColumn": H2_MASS_ABUNDANCE,
}

H2_PLUS_NUMBER_DENSITY = {
    "fieldType": "derived",
    "accessor": 25,
    "label": "H2+ Number Density",
    "unit": "# particles / cm^3",
    "type": "number_density",
    "dependentColumn": H2_PLUS_MASS_ABUNDANCE,
}

H2_PLUS_MASS_DENSITY = {
    "fieldType": "derived",
    "accessor": 26,
    "label": "H2+ Mass Density",
    "unit": "g / cm^3",
    "type": "mass_density",
    "dependentColumn": H2_PLUS_MASS_ABUNDANCE,
}
