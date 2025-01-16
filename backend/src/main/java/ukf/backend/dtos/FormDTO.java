package ukf.backend.dtos;

import lombok.Data;

@Data
public class FormDTO {
    private Long id;
    private String review;
    private Integer aktualnostNarocnostPrace;
    private String orientovanieStudentaProblematike;
    private String vhodnostZvolenychMetod;
    private String rozsahUrovenDosiahnutychVysledkov;
    private String analyzaInterpretaciaVysledkov;
    private Character prehladnostLogickaStrukturaPrace;
    private Character formalnaJazykovaStylistickaUrovenPrace;
    private Boolean pracaZodpovedaSablone;
    private Boolean chybaNazovPrace;
    private Boolean chybaMenoAutora;
    private Boolean chybaPracovnaEmailovaAdresa;
    private Boolean chybaAbstrakt;
    private Boolean abstraktNesplnaRozsah;
    private Boolean chybajuKlucoveSlova;
    private Boolean chybajuUvodVysledkyDiskusia;
    private Boolean nieSuUvedeneZdroje;
    private Boolean chybaRef;
    private Boolean chybaRefObr;
    private Boolean obrazkomChybaPopis;
    private String prinos;
}
