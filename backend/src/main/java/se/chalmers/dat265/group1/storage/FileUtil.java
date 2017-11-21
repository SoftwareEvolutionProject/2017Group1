package se.chalmers.dat265.group1.storage;

import java.io.*;

public class FileUtil {
    public static void write(byte[] bytes, String filePath) throws IOException {
        OutputStream os = new FileOutputStream(filePath);
        os.write(bytes);
        os.flush();
        os.close();
    }
}
