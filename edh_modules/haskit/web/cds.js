
/**
 * Map dtype to js typed array constructor
 *
 * @param dt dtype identifier
 */
export function dtype2ArrayCtor(dt) {
  switch (dt) {
    case "int32":
      return Int32Array
    case "float32":
      return Float32Array
    case "float64":
      return Float64Array
  }
  throw new Error(`Unsupported dtype: [${dt}] !`)
}


export async function cdsReceive(
  peer, cdsContainer, cdsClass,
  dsName, colNames, colDtypes,
) {
  // arm a fresh new sink to receive the stream of column data
  const dataSink = peer.armChannel("data")

  // don't continue landing following commands until dataSink gets looped,
  // or there's race condition for some column data to be missed.
  return new Promise(async (resolve, _reject) => {
    const cdsData = {}
    let colCntr = 0

    for await (const colData of dataSink.runProducer(async () => {
      resolve(undefined)
    })) {
      cdsData[colNames[colCntr]] = new (dtype2ArrayCtor(colDtypes[colCntr]))(
        colData
      )
      if (++colCntr >= colNames.length) {
        break
      }
    }

    cdsContainer[dsName] = new cdsClass({
      data: cdsData,
    })
  })
}
