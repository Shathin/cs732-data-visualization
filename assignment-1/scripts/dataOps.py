import pandas
import numpy
import math
from scalarFields import *
import formulae


def getFiles(timestepRange=range(0, 200), path: str = "./"):
    return [
        rf"{path}/multifield.{'{:04d}'.format(timestep)}.zslice.txt"
        for timestep in timestepRange
    ]


def readDataSet(files: list[str], fields: list[dict]) -> list[pandas.DataFrame]:

    if files == None or len(files) == 0:
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


def getLocalMaximaAndMinima(
    data: pandas.DataFrame,
    field: dict,
) -> tuple[float, float]:
    return (data[field["accessor"]].max(), data[field["accessor"]].min())


def getGlobalMaximaAndMinima(
    dataSet: list[pandas.DataFrame],
    field: dict,
) -> tuple[float, float]:
    if dataSet != None and len(dataSet) > 0 and field != None:
        gMax = -math.inf  # Global Maxima
        gMin = math.inf  # Global Minima

        for data in dataSet:
            (lMax, lMin) = getLocalMaximaAndMinima(
                data=data,
                field=field,
            )

            gMax = max(gMax, lMax)
            gMin = min(gMin, lMin)

        return (gMax, gMin)

    else:
        return None


def processDataSet(
    dataSet: list[pandas.DataFrame], field: dict
) -> list[pandas.DataFrame]:
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
            filter(
                lambda col: col != field["accessor"],
                dataSet[iter].columns.values,
            )
        )
        dataSet[iter].drop(
            dropFields,
            inplace=True,
            axis=1,
        )

    return dataSet
