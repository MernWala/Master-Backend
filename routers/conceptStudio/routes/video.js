const express = require('express')
const fs = require('fs')
const router = express.Router();

const file = {
    'vid1': '../../../assets/video/introUs.webm',
}

router.get('/:video', (req, res) => {
    try {
        const range = req.headers.range
        const videoPath = file[req.params.video];
        const videoSize = fs.statSync(videoPath).size
        const chunkSize = 1000000;
        const start = Number(range.replace(/\D/g, ""))
        const end = Math.min(start + chunkSize, videoSize - 1)
        const contentLength = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        }

        res.writeHead(206, headers)
        const stream = fs.createReadStream(videoPath, { start, end })
        stream.pipe(res)
        
    } catch (error) {
        return res.status(400).json({ status: 'Bad Request' })
    }
})

module.exports = router