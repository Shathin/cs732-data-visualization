import pandas
import numpy
import math
from scalarFields import *
from vectorFields import *
import formulae


def readDataSet(
    files: list[str],
    fields: list[dict],
) -> list[pandas.DataFrame]:
    """
    Reads the `fields` from the `files` passed in as the argument and returns a list of `pandas.DataFrame`.

    Parameters:
    - files : List of files (paths) to be read
    - fields : List of dictionaries that describe the fields to be read. The dictionary is expected to have the 'accessor' key which represents the column index of the field

    Returns:
    - List of `pandas.DataFrame` that represent each data set file
    """

    if files == None or len(files) == 0:
        print("No file names were passed!")
        return None

    # * List of DataFrames representing each data file
    dataSet: list[pandas.DataFrame] = []

    # * Columns to be read
    fields = [field["accessor"] for field in fields] if fields != None else None

    for file in files:
        data: pandas.DataFrame = pandas.read_csv(
            file,
            delim_whitespace=True,
            header=None,
            usecols=fields,
            lineterminator="\n",
            dtype=numpy.float64,
        )

        dataSet.append(data)

    return dataSet


def getLMaxMin(
    data: pandas.DataFrame,
    field: dict,
) -> tuple[float, float]:
    """
    Gets the maximum and minimum value of a field in the data

    Parameters:
    - data - A pandas.DataFrame that represents one data set file
    - field - A dictionary that represents the field on which the max min is to be computed

    Returns:
    - A tuple (max, min)
    """
    return (data[field["accessor"]].max(), data[field["accessor"]].min())


def getGMaxMin(
    dataSet: list[pandas.DataFrame],
    field: dict,
) -> tuple[float, float]:
    """
    Gets the maximum and minimum value of a field in the entire data set

    Parameters:
    - dataSet - A list of pandas.DataFrame that represents the entire data set
    - field - A dictionary that represents the field on which the max min is to be computed

    Returns:
    - A tuple (max, min)
    """
    if dataSet != None and len(dataSet) > 0 and field != None:
        gMax = -math.inf  # Global Maxima
        gMin = math.inf  # Global Minima

        for data in dataSet:
            (lMax, lMin) = getLMaxMin(
                data=data,
                field=field,
            )

            gMax = max(gMax, lMax)
            gMin = min(gMin, lMin)

        return (gMax, gMin)

    else:
        return None


def computeDerivedScalarFields(
    dataSet: list[pandas.DataFrame], fields: list[dict]
) -> list[pandas.DataFrame]:
    """
    Computes the derived scalar fields in the data set.

    Parameters:
    - dataSet - A list of pandas.DataFrame that represents the entire data set
    - fields - The fields to be computed

    Returns:
    - A list of pandas.DataFrame that contains the new fields
    """
    for iter in range(len(dataSet)):
        print("*** *** Computing derived fields 🧮")

        dataSet[iter][TOTAL_DENSITY["accessor"]] = dataSet[iter].apply(
            lambda row: formulae.getTotalDensity(
                tpd=row[TOTAL_PARTICLE_DENSITY["accessor"]],
                h=row[H_MASS_ABUNDANCE["accessor"]],
                hP=row[H_PLUS_MASS_ABUNDANCE["accessor"]],
                hM=row[H_MINUS_MASS_ABUNDANCE["accessor"]],
                he=row[HE_MASS_ABUNDANCE["accessor"]],
                heP=row[HE_PLUS_MASS_ABUNDANCE["accessor"]],
                hePP=row[HE_PLUS_PLUS_MASS_ABUNDANCE["accessor"]],
                h2=row[H2_MASS_ABUNDANCE["accessor"]],
                h2P=row[H2_PLUS_MASS_ABUNDANCE["accessor"]],
            ),
            axis=1,
        )

        for field in fields:
            if "type" in field and "dependentColumn" in field:
                if field["type"] == "number_density":
                    if (
                        field == H_NUMBER_DENSITY
                        or field == H_PLUS_NUMBER_DENSITY
                        or field == H_MINUS_NUMBER_DENSITY
                    ):
                        dataSet[iter][field["accessor"]] = dataSet[iter].apply(
                            lambda row: formulae.getHNumberDensity(
                                h=row[field["dependentColumn"]["accessor"]],
                                td=row[TOTAL_DENSITY["accessor"]],
                            ),
                            axis=1,
                        )
                    elif (
                        field == HE_NUMBER_DENSITY
                        or field == HE_PLUS_NUMBER_DENSITY
                        or field == HE_PLUS_PLUS_NUMBER_DENSITY
                    ):
                        dataSet[iter][field["accessor"]] = dataSet[iter].apply(
                            lambda row: formulae.getHeNumberDensity(
                                he=row[field["dependentColumn"]["accessor"]],
                                td=row[TOTAL_DENSITY["accessor"]],
                            ),
                            axis=1,
                        )
                    elif field == H2_NUMBER_DENSITY or field == H2_PLUS_NUMBER_DENSITY:
                        dataSet[iter][field["accessor"]] = dataSet[iter].apply(
                            lambda row: formulae.getH2NumberDensity(
                                h2=row[field["dependentColumn"]["accessor"]],
                                td=row[TOTAL_DENSITY["accessor"]],
                            ),
                            axis=1,
                        )
                elif field["type"] == "mass_density":
                    dataSet[iter][field["accessor"]] = dataSet[iter].apply(
                        lambda row: formulae.getMassDensity(
                            ma=row[field["dependentColumn"]["accessor"]],
                            td=row[TOTAL_DENSITY["accessor"]],
                        ),
                        axis=1,
                    )

        print("*** *** Cleaning up unwanted columns 🗑️")
        dropFields: list = list(
            set(dataSet[iter].columns.values)
            - set(field["accessor"] for field in fields)
        )
        dataSet[iter].drop(
            dropFields,
            inplace=True,
            axis=1,
        )

    return dataSet


def computeCurl(
    dataSet: list[pandas.DataFrame],
) -> list[pandas.DataFrame]:
    """
    Computes the curl of the velocity in the data set.

    Parameter:
    - dataSet - A list of pandas.DataFrame that represents the entire data set

    Returns:
    - A list of pandas.DataFrame that contains the curl fields
    """

    def getRow(
        data: pandas.DataFrame,
        x: int,
        y: int,
        z: int,
    ):
        if x >= 600 or y >= 248:
            return (0, 0, 0)

        index: int = x + y * 600 + z * 600 * 248

        return tuple(data.iloc[index])

    for data in dataSet:
        print("*** *** Computing Curl 🧮")
        curlX: list = []
        curlY: list = []
        curlZ: list = []
        curlMag: list = []

        for z in range(1):
            for y in range(248):
                for x in range(600):
                    row: tuple = getRow(data, x, y, z)
                    rowX: tuple = getRow(data, x + 1, y, z)
                    rowY: tuple = getRow(data, x, y + 1, z)
                    rowZ: tuple = getRow(data, x, y, z + 1)

                    cx = (rowY[2] - row[2] - rowZ[1] + row[1]) / 0.001
                    cy = (rowZ[0] - row[0] - rowX[2] + row[2]) / 0.001
                    cz = (rowX[1] - row[1] - rowY[0] + row[0]) / 0.001

                    curlX.append(cx)
                    curlY.append(cy)
                    curlZ.append(cz)

                    curlMag.append(math.sqrt(cx ** 2 + cy ** 2 + cz ** 2))

        print("*** *** Cleaning up unwanted columns and rows🗑️")
        data.drop(
            data.loc[148800:].index,
            inplace=True,
        )

        dropColumns: list[int] = [
            I_COMPONENT["accessor"],
            J_COMPONENT["accessor"],
            K_COMPONENT["accessor"],
            # CURL_Z["accessor"],
        ]
        data.drop(
            dropColumns,
            inplace=True,
            axis=1,
        )

        print("*** *** Adding computed columns 🎲")
        data[CURL_X["accessor"]] = curlX
        data[CURL_Y["accessor"]] = curlY
        # data[CURL_Z["accessor"]] = curlZ # Unnecessary column
        data[CURL_MAG["accessor"]] = curlMag

    return dataSet
