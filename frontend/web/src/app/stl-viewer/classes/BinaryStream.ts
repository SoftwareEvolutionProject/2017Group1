/**
    @class BinaryStream
    The helper class to parse data from a binary stream.
*/
export class BinaryStream {
    data;
    offset;

    constructor(data, isBigEndian) {
        if (isBigEndian) {
            throw new Error('JSC3D.BinaryStream constructor failed: Big endian is not supported yet!');
        }

        this.data = data;
        this.offset = 0;
    }

    /**
        Get the full length (in bytes) of the stream.
        @returns {Number} the length of the stream.
    */
    size() {
        return this.data.length;
    }

    /**
        Get current position of the indicator.
        @returns {Number} current position in stream.
    */
    tell() {
        return this.offset;
    }

    /**
        Set the position indicator of the stream to a new position.
        @param {Number} position the new position.
        @returns {Boolean} true if succeeded; false if the given position is out of range.
    */
    seek(position) {
        if (position < 0 || position >= this.data.length) {
            return false;
        }

        this.offset = position;

        return true;
    }

    /**
        Reset the position indicator to the beginning of the stream.
    */
    reset() {
        this.offset = 0;
    }

    /**
        Advance the position indicator to skip a given number of bytes.
        @param {Number} bytesToSkip the number of bytes to skip.
    */
    skip(bytesToSkip) {
        if (this.offset + bytesToSkip > this.data.length) {
            this.offset = this.data.length;
        }
        else {
            this.offset += bytesToSkip;
        }
    }

    /**
        Get count of the remaining bytes in the stream.
        @returns {Number} the number of bytes from current position to the end of the stream.
    */
    available() {
        return this.data.length - this.offset;
    }

    /**
        See if the position indicator is already at the end of the stream.
        @returns {Boolean} true if the position indicator is at the end of the stream; false if not.
    */
    eof() {
        return !(this.offset < this.data.length);
    }

    /**
        Read an 8-bits' unsigned int number.
        @returns {Number} an 8-bits' unsigned int number, or NaN if any error occured.
    */
    readUInt8() {
        return this.decodeInt(1, false);
    }

    /**
        Read an 8-bits' signed int number.
        @returns {Number} an 8-bits' signed int number, or NaN if any error occured.
    */
    readInt8() {
        return this.decodeInt(1, true);
    }

    /**
        Read a 16-bits' unsigned int number.
        @returns {Number} a 16-bits' unsigned int number, or NaN if any error occured.
    */
    readUInt16() {
        return this.decodeInt(2, false);
    }

    /**
        Read a 16-bits' signed int number.
        @returns {Number} a 16-bits' signed int number, or NaN if any error occured.
    */
    readInt16() {
        return this.decodeInt(2, true);
    }

    /**
        Read a 32-bits' unsigned int number.
        @returns {Number} a 32-bits' unsigned int number, or NaN if any error occured.
    */
    readUInt32() {
        return this.decodeInt(4, false);
    }

    /**
        Read a 32-bits' signed int number.
        @returns {Number} a 32-bits' signed int number, or NaN if any error occured.
    */
    readInt32() {
        return this.decodeInt(4, true);
    }

    /**
        Read a 32-bits' (IEEE 754) floating point number.
        @returns {Number} a 32-bits' floating point number, or NaN if any error occured.
    */
    readFloat32() {
        return this.decodeFloat(4, 23);
    }

    /**
        Read a 64-bits' (IEEE 754) floating point number.
        @returns {Number} a 64-bits' floating point number, or NaN if any error occured.
    */
    readFloat64() {
        return this.decodeFloat(8, 52);
    }

    /**
        Read a piece of the stream into a given buffer.
        @param {Array} buffer the buffer to receive the result.
        @param {Number} bytesToRead length of the piece to be read, in bytes.
        @returns {Number} the total number of bytes that are successfully read.
    */
    readBytes(buffer, bytesToRead) {
        let bytesRead = bytesToRead;
        if (this.offset + bytesToRead > this.data.length) {
            bytesRead = this.data.length - this.offset;
        }

        for (let i = 0; i < bytesRead; i++) {
            buffer[i] = this.data[this.offset++].charCodeAt(0) & 0xff;
        }

        return bytesRead;
    }

    /**
        @private
    */
    decodeInt(bytes, isSigned) {
        // are there enough bytes for this integer?
        if (this.offset + bytes > this.data.length) {
            this.offset = this.data.length;
            return NaN;
        }

        let rv = 0, f = 1;
        for (let i = 0; i < bytes; i++) {
            rv += ((this.data[this.offset++].charCodeAt(0) & 0xff) * f);
            f *= 256;
        }

        if ( isSigned && (rv & Math.pow(2, bytes * 8 - 1)) ) {
            rv -= Math.pow(2, bytes * 8);
        }

        return rv;
    }

    /**
        @private
    */
    decodeFloat(bytes, significandBits) {
        // are there enough bytes for the float?
        if (this.offset + bytes > this.data.length) {
            this.offset = this.data.length;
            return NaN;
        }

        let mLen = significandBits;
        let eLen = bytes * 8 - mLen - 1;
        let eMax = (1 << eLen) - 1;
        let eBias = eMax >> 1;

        let i = bytes - 1;
        let d = -1;
        let s = this.data[this.offset + i].charCodeAt(0) & 0xff;
        i += d;
        let bits = -7;
        let e = s & ((1 << (-bits)) - 1);
        s >>= -bits;
        bits += eLen;
        while (bits > 0) {
            e = e * 256 + (this.data[this.offset + i].charCodeAt(0) & 0xff);
            i += d;
            bits -= 8;
        }

        let m = e & ((1 << (-bits)) - 1);
        e >>= -bits;
        bits += mLen;
        while (bits > 0) {
            m = m * 256 + (this.data[this.offset + i].charCodeAt(0) & 0xff);
            i += d;
            bits -= 8;
        }

        this.offset += bytes;

        switch (e) {
        case 0:		// 0 or denormalized number
            e = 1 - eBias;
            break;
        case eMax:	// NaN or +/-Infinity
            return m ? NaN : ((s ? -1 : 1) * Infinity);
        default:	// normalized number
            m += Math.pow(2, mLen);
            e -= eBias;
            break;
        }

        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    }

}
