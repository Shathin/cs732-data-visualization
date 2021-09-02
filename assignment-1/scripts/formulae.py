MASS_OF_HYDROGEN = 1.38066e-24


def getTotalDensity(tpd, h, hP, hM, he, heP, hePP, h2, h2P):
    """
    Computes the total density from the total particle density and the mass abundance of all the chemical species

    Parameters
    - tpd -> Total Particle Density
    - h -> H Mass Abundance
    - hP -> H+ Mass Abundance
    - hM -> H- Mass Abundance
    - he -> He Mass Abundance
    - heP -> He+ Mass Abundance
    - hePP -> He++ Mass Abundance
    - h2 -> H2 Mass Abundance
    - h2P -> H2+ Mass Abundance
    """
    return (tpd * MASS_OF_HYDROGEN) / (
        h + hP + hM + 0.25 * (he + heP + hePP) + 0.5 * (h2 + h2P)
    )


def getHNumberDensity(h, td):
    """
    Computes the number density of H / H+ / H- atoms

    Parameters:
    - h -> Mass Abundance
    - tp -> Total Density
    """
    return h * td / MASS_OF_HYDROGEN


def getHeNumberDensity(he, td):
    """
    Computes the number density of He / He+ / He++ atoms

    Parameters:
    - he -> Mass Abundance
    - tp -> Total Density
    """
    return he * td / (4 * MASS_OF_HYDROGEN)


def getH2NumberDensity(h2, td):
    """
    Computes the number density of H2 / H2+ atoms

    Parameters:
    - h2 -> Mass Abundance
    - tp -> Total Density
    """
    return h2 * td / (2 * MASS_OF_HYDROGEN)


def getMassDensity(td, ma):
    """
    Computes the species mass density

    Parametes:
    - td -> Total Density
    - ma -> Species Mass Abundance
    """
    return td * ma
