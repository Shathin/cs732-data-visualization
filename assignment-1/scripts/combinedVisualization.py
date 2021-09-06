import pandas
import numpy
from matplotlib import pyplot
import math
from dataOps import readDataSet, getGMaxMin, computeCurl, computeDerivedScalarFields
from scalarFields import *
from vectorFields import *


def visualize(
    scalarData: pandas.DataFrame,
    vectorData: pandas.DataFrame,
    scalarField: dict,
    zMax,
    zMin,
    cMax,
    cMin,
    contourLevels=5,
    showFigure: bool = True,
    saveFigure: bool = True,
    saveFile: str = "combined-output",
):
    """
    Creates a quiver plot overlapped on a contour fill plot based on the vectorData and scalarData respectively

    Parameters:
    - scalarData : A pandas.DataFrame to be used for the contour fill plot
    - vectorData : A pandas.DataFrame to be sued for the quiver plot
    - scalarField : The field to be used as the 3rd dimension of the contour fill plot
    - zMax : Maximum value of the scalarField in the scalarData
    - zMin : Minimum value of the scalarField in the scalarData
    - cMax : Maximum value of the magnitude of the curl in the vectorData
    - cMin : Minimum value of the magnitude of the curl in the vectorData
    - contourLevels - Number of levels of contour
    - showFigure - Show the plot in an interactive window
    - saveFigure - Save the figure to a file
    - saveFile - The save file name to be used
    """
    # * Define the X and Y co-ordinate range
    X: list[float] = numpy.linspace(0.0, 0.6, 600)
    Y: list[float] = numpy.linspace(0.0, 0.248, 248)

    # * Z dimension for (scalar) contour plot
    Z = numpy.array(scalarData[scalarField["accessor"]]).reshape(len(Y), len(X))

    # * Determine levels
    levels = numpy.linspace(zMin, zMax, contourLevels)

    # * U, V, C for (vector) quiver plot
    U = numpy.array(vectorData[CURL_X["accessor"]]).reshape(len(Y), len(X))
    V = numpy.array(vectorData[CURL_Y["accessor"]]).reshape(len(Y), len(X))
    C = numpy.array(vectorData[CURL_MAG["accessor"]]).reshape(len(Y), len(X))

    # * Change unit to Parsec
    U *= 3.2407792700054e-14
    V *= 3.2407792700054e-14
    C *= 3.2407792700054e-14

    # * Compute the scale and normalize
    scale = None
    norm = None
    if cMax != None and cMin != None:
        cMax *= 3.2407792700054e-14
        cMin *= 3.2407792700054e-14
        scale = 10 ** (math.floor(math.log10(cMax)) + 2)
        norm = pyplot.Normalize(cMax, cMin)

        # * Define figure
    pyplot.figure(figsize=(10, 5))

    # * Define axis labels
    pyplot.xlabel("X | parsec")
    pyplot.ylabel("Y | parsec")

    # * Set X and Y Ticks
    pyplot.xticks(numpy.arange(min(X), max(X), 0.06))
    pyplot.yticks(numpy.arange(min(Y), max(Y), 0.03))

    # * Define title
    pyplot.title(f"{scalarField['label']} & Curl of Velocity")

    # * Draw Contour Fill plot
    contourf = pyplot.contourf(
        X,
        Y,
        Z,
        levels,
        cmap=scalarField["colorMap"] if "colorMap" in scalarField else "Blues_r",
    )

    # * Draw quiver
    quiver = pyplot.quiver(
        X,
        Y,
        U,
        V,
        C,
        norm=norm,
        scale=scale,
        angles="xy",
        scale_units="xy",
        minshaft=1,
        minlength=0,
    )

    # * Add colorbar
    pyplot.colorbar(contourf, label=f"{scalarField['label']} | {scalarField['unit']}")
    pyplot.colorbar(quiver, label="Magnitude of the Curl the velocity | parsec/s")

    if showFigure:
        print("*** *** Showing figure 🖥️")
        pyplot.show()
    if saveFigure:
        print("*** *** Saving figure 💾")
        pyplot.savefig(f"{saveFile}.png")


if __name__ == "__main__":
    print("*** Getting file names ")
    # timestepRange = range(1, 200)
    timestepRange = [1, 2, 3, 6, 9, 14, 19, 29, 49, 69, 99, 129, 159, 189]
    # timestepRange = [1, 49, 99, 149, 199]

    scalarPath: str = "./data/extracted/scalar"
    vectorPath: str = "./data/extracted/vector"

    scalarFiles: list[str] = [
        rf"{scalarPath}/multifield.{'{:04d}'.format(timestep)}.zslice.txt"
        for timestep in timestepRange
    ]

    vectorFiles: list[str] = [
        rf"{vectorPath}/velocity.{'{:04d}'.format(timestep)}.zslice.txt"
        for timestep in timestepRange
    ]

    print("*** Reading vector data set 🗃️")
    vectorDataSet: list[pandas.DataFrame] = readDataSet(
        files=vectorFiles,
        fields=[
            I_COMPONENT,
            J_COMPONENT,
            K_COMPONENT,
        ],
    )
    print("*** Processing data ⛓️")
    vectorDataSet = computeCurl(dataSet=vectorDataSet)
    cMax, cMin = getGMaxMin(dataSet=vectorDataSet, field=CURL_MAG)

    scalarFieldList = [
        GAS_TEMPERATURE,
        TOTAL_PARTICLE_DENSITY,
        H_NUMBER_DENSITY,
        H_MINUS_NUMBER_DENSITY,
        H_PLUS_NUMBER_DENSITY,
    ]
    # scalarField = GAS_TEMPERATURE
    # scalarField = TOTAL_PARTICLE_DENSITY
    # scalarField = H_NUMBER_DENSITY
    # scalarField = H_MINUS_NUMBER_DENSITY
    # scalarField = H_PLUS_NUMBER_DENSITY

    for scalarField in scalarFieldList:
        print()
        print(f"Field - {scalarField['label']}")
        scalarDataSet: list[pandas.DataFrame] = None
        print("*** Reading scalar multifield data set 🗃️")
        if scalarField["fieldType"] == "given":
            scalarDataSet = readDataSet(
                files=scalarFiles,
                fields=[scalarField],
            )
        elif scalarField["fieldType"] == "derived":
            scalarDataSet = readDataSet(
                files=scalarFiles,
                fields=[
                    TOTAL_PARTICLE_DENSITY,
                    H_MASS_ABUNDANCE,
                    H_PLUS_MASS_ABUNDANCE,
                    H_MINUS_MASS_ABUNDANCE,
                    HE_MASS_ABUNDANCE,
                    HE_PLUS_MASS_ABUNDANCE,
                    HE_PLUS_PLUS_MASS_ABUNDANCE,
                    H2_MASS_ABUNDANCE,
                    H2_PLUS_MASS_ABUNDANCE,
                ],
            )
            print("*** Processing data ⛓️")
            scalarDataSet = computeDerivedScalarFields(
                dataSet=scalarDataSet,
                fields=[scalarField],
            )
        else:
            exit(0)

        # * Get global max & min of the field in the data set
        zMax, zMin = getGMaxMin(dataSet=scalarDataSet, field=scalarField)

        for iter, timestep in enumerate(timestepRange):
            visualize(
                scalarData=scalarDataSet[iter],
                vectorData=vectorDataSet[iter],
                zMax=zMax,
                zMin=zMin,
                cMax=cMax,
                cMin=cMin,
                scalarField=scalarField,
                contourLevels=15,
                showFigure=False,
                saveFigure=True,
                saveFile=f"{scalarField['label']} x Curl of Velocity - {timestep}",
            )
