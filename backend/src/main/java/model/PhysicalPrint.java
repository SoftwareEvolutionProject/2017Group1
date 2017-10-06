package model;

public class PhysicalPrint {
    private int id;
    private int digitalPrintID;
    private String slmPath;
    private PostPrintData postPrintData;

    public int getId() {
        return id;
    }

    public int getDigitalPrintID() {
        return digitalPrintID;
    }

    public String getSlmPath() {
        return slmPath;
    }

    public PostPrintData getPostPrintData() {
        return postPrintData;
    }
}
