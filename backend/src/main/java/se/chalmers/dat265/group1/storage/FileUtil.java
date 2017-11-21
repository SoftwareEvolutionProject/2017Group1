package se.chalmers.dat265.group1.storage;

import java.io.*;

public class FileUtil {
    public static void writeToFile(InputStream is, String filePath) throws IOException {
        OutputStream os = new FileOutputStream(filePath);

        byte[] buffer = new byte[1024];
        int bytesRead;
        //read from is to buffer
        while((bytesRead = is.read(buffer)) !=-1){
            os.write(buffer, 0, bytesRead);
        }
        is.close();
        //flush OutputStream to write any buffered data to file
        os.flush();
        os.close();
    }

    public static void write(byte[] bytes, String filePath) throws IOException {
        OutputStream os = new FileOutputStream(filePath);
        os.write(bytes);
        os.flush();
        os.close();
    }
}
