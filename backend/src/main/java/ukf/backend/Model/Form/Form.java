package ukf.backend.Model.Form;

import jakarta.persistence.*;
import lombok.*;
import ukf.backend.Model.Conference.Conference;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String aktualnostNarocnostPrace;
    private String orientovanieStudentaProblematike;
    private String vhodnostZvolenychMetod;
    private String rozsahUrovenDosiahnutychVysledkov;
    private String analyzaInterpretaciaVysledkov;
    private String prehladnostLogickaStrukturaPrace;
    private String formalnaJazykovaStylistickaUrovenPrace;
    private String pracaZodpovedaSablone;
    private Boolean chybaNazovPrace;
    private Boolean chybaMenoAutora;
    private Boolean chybaPracovnaEmailovaAdresa;
    private Boolean chybaAbstrakt;
    private Boolean abstraktNesplnaRozsah;
    private Boolean chybajuKlucoveSlova;
    private Boolean chybajuUvodVysledkyDiskusia;
    private Boolean nieSuUvedeneZdroje;
    private Boolean obrazkomChybaPopis;
    private Boolean chybaRef;
    private Boolean chybaRefObr;
    private String prinos;
    private String nedostatky;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Conference> conferences;
}