const Busboy = require('busboy')
const { logger, pipelineAsync } = require('../utils/util')
const { join } = require('path')
const { createWriteStream } = require('fs')
const csv = require('csv-parser')
const ON_UPLOAD_EVENT = "file-uploaded"
const Document = require('../models/document')
const DocumentValidator = require('../services/documentValidator')

class UploadHandler {
    #io
    #socketId
    constructor(io, socketId) {
        this.#io = io
        this.#socketId = socketId
    }

    registerEvents(headers, onFinish) {
        const busboy = new Busboy({ headers })

        busboy.on("file", this.#onFile.bind(this))

        busboy.on("finish", onFinish)

        return busboy
    }

    #handleFileBytes(filename) {
        async function * handleData(data) {
            for await (const item of data) {
                const size = item.length
                this.#io.to(this.#socketId).emit(ON_UPLOAD_EVENT, size)

                yield item
            }
        }

        return handleData.bind(this)
    }

    async #onFile(fieldname, file, filename) {
        const saveFileTo = join(__dirname, '../../', 'downloads', filename)
        logger.info('Uploading: ' + saveFileTo)

        if (filename.endsWith('.csv')) {
            await pipelineAsync(
                file,
                csv(),
                this.#convertToBuffer(),
                this.#validateCSVData(),
                createWriteStream(saveFileTo)
            )
        } else {
            await pipelineAsync(
                file,
                this.#handleFileBytes.apply(this, [ filename ]),
                createWriteStream(saveFileTo)
            )
        }

        logger.info(`File [${filename}] finished!`)
    }

    #convertToBuffer() {
        return async function * (source) {
            for await (const data of source) {
                yield Buffer.from(JSON.stringify(data))
            }
        }
    }

    #validateCSVData() {
        const results = []
        return async function * (source) {
            for await (const data of source) {
                const document = new Document(JSON.parse(data.toString()));

                if (!DocumentValidator.validate(document)) {
                    const validDocument = DocumentValidator.convertDocumentValues(document);
                    console.log('validDocument', validDocument)
                    results.push(validDocument);
                    yield data
                } else {
                    logger.warn(`Invalid data:`)
                    console.log(document)
                }
            }
            this.#io.to(this.#socketId).emit('csv-processed', results)
        }.bind(this)
    }

    #isValidData(data) {
        console.log('data', data)
        return true
    }
}

module.exports = UploadHandler