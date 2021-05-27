
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
  colNames, colDtypes,
  peer, cdsSaveData,
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

    cdsSaveData(cdsData)
  })
}

export async function cdsUpdate(
  colNames, colDtypes,
  peer, cds,
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

    cds.data = (new cds.constructor({
      data: cdsData,
    })).data
  })
}


export function cdsServiceSuite(hskiPageConn, cdsContainer, bkh,) {
  return {

    receiveDataSource: async function receiveDataSource(
      dsName, colNames, colDtypes,
    ) {
      await hskiPageConn.ifAlive(peer => {
        return cdsReceive(
          colNames, colDtypes,
          peer, cdsData => cdsContainer[dsName] =
            new bkh.ColumnDataSource({ data: cdsData }),
        )
      })
    },

    updateDataSource: async function updateDataSource(
      cds, colNames, colDtypes,
    ) {
      await hskiPageConn.ifAlive(peer => {
        return cdsUpdate(
          colNames, colDtypes,
          peer, cds,
        )
      })
    },

    cds: function cds(dsName) {
      return cdsContainer[dsName]
    }

  }
}
