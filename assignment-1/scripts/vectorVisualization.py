import numpy
import pandas
from matplotlib import pyplot, animation, cm, colors
import math
from dataOps import readDataSet, computeCurl, getGMaxMin
from vectorFields import *


def visualize(
    data: pandas.DataFrame,
    gMax=None,
    gMin=None,
    showFigure: bool = True,
    saveFigure: bool = True,
    saveFile: str = "static-quiver",
):
    """
    Creates a quiver (arrow) plot for the `pandas.DataFrame` passed in as the argument

    Parameters:
    - data - A pandas.DataFrame that represents the dataset
    - gMax - Maximum value of the curl of the magnitude (Used for scale & normalization)
    - gMin - Minimum value of the curl of the magnite (Used for normalization)
    - showFigure - Show the plot in interactive mode
    - saveFigure - Save the figure to a file
    - saveFile - The save file name to be used
    """
    # * Define X and Y co-ordinate range
    X: list[float] = numpy.arange(0.0, 0.6, 0.001)
    Y: list[float] = numpy.arange(0.0, 0.248, 0.001)

    # * Define U, V, and Z
    U = numpy.array(data[CURL_X["accessor"]]).reshape(len(Y), len(X))
    V = numpy.array(data[CURL_Y["accessor"]]).reshape(len(Y), len(X))
    C = numpy.array(data[CURL_MAG["accessor"]]).reshape(len(Y), len(X))

    # * Change unit to Parsec
    U *= 3.2407792700054e-14
    V *= 3.2407792700054e-14
    C *= 3.2407792700054e-14

    # * Compute the scale and normalize
    scale = None
    norm = None
    if gMax != None and gMin != None:
        gMax *= 3.2407792700054e-14
        gMin *= 3.2407792700054e-14
        scale = 10 ** (math.floor(math.log10(gMax)) + 2)
        norm = pyplot.Normalize(gMax, gMin)

    # * Define the figure
    pyplot.figure(figsize=(15, 10))

    # * Define axis labels
    pyplot.xlabel("X | parsec")
    pyplot.ylabel("Y | parsec")

    # * Define title
    pyplot.title("Curl of the Velocity | parsec/s")

    # * Draw quiver
    pyplot.quiver(
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
    pyplot.colorbar(label="Magnitude of the Curl the velocity | parsec/s}")

    if saveFigure:
        print("*** *** Saving figure 💾")
        pyplot.savefig(f"{saveFile}.png")

    if showFigure:
        print("*** *** Showing figure 🖥️")
        pyplot.show()


if __name__ == "__main__":
    print("*** Getting file names ")
    # timestepRange = range(1, 200)
    timestepRange = [1, 2, 3, 6, 9, 14, 19, 29, 49, 69, 99, 129, 159, 189]

    path: str = "./data/extracted/vector"

    files: list[str] = [
        rf"{path}/velocity.{'{:04d}'.format(timestep)}.zslice.txt"
        for timestep in timestepRange
    ]

    print("*** Reading data files 📃")
    dataSet: list[pandas.DataFrame] = readDataSet(
        files=files,
        fields=[
            I_COMPONENT,
            J_COMPONENT,
            K_COMPONENT,
        ],
    )

    print("*** Processing data ⛓️")
    dataSet = computeCurl(dataSet=dataSet)

    curlMax, curlMin = getGMaxMin(dataSet=dataSet, field=CURL_MAG)

    for index, data in enumerate(dataSet):
        visualize(
            data=data,
            gMax=curlMax,
            gMin=curlMin,
            showFigure=False,
            saveFigure=True,
            saveFile=f"./outputs/curl-arrow-{index}",
        )
