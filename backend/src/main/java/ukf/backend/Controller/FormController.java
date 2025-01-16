package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.Form.Form;
import ukf.backend.Model.Form.FormRepository;
import ukf.backend.dtos.FormDTO;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
public class FormController {

    @Autowired
    private FormRepository formRepository;

    @GetMapping
    public List<Form> getAllForms() {
        return formRepository.findAll();
    }

    @GetMapping("/{id}")
    public Form getFormById(@PathVariable Long id) {
        return formRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Form createForm(@RequestBody FormDTO formDTO) {
        Form form = new Form();
        form.setReview(formDTO.getReview());
        form.setAktualnostNarocnostPrace(formDTO.getAktualnostNarocnostPrace());
        form.setOrientovanieStudentaProblematike(formDTO.getOrientovanieStudentaProblematike());
        form.setVhodnostZvolenychMetod(formDTO.getVhodnostZvolenychMetod());
        form.setRozsahUrovenDosiahnutychVysledkov(formDTO.getRozsahUrovenDosiahnutychVysledkov());
        form.setAnalyzaInterpretaciaVysledkov(formDTO.getAnalyzaInterpretaciaVysledkov());
        form.setPrehladnostLogickaStrukturaPrace(formDTO.getPrehladnostLogickaStrukturaPrace());
        form.setFormalnaJazykovaStylistickaUrovenPrace(formDTO.getFormalnaJazykovaStylistickaUrovenPrace());
        form.setPracaZodpovedaSablone(formDTO.getPracaZodpovedaSablone());
        form.setChybaNazovPrace(formDTO.getChybaNazovPrace());
        form.setChybaMenoAutora(formDTO.getChybaMenoAutora());
        form.setChybaPracovnaEmailovaAdresa(formDTO.getChybaPracovnaEmailovaAdresa());
        form.setChybaAbstrakt(formDTO.getChybaAbstrakt());
        form.setAbstraktNesplnaRozsah(formDTO.getAbstraktNesplnaRozsah());
        form.setChybajuKlucoveSlova(formDTO.getChybajuKlucoveSlova());
        form.setChybajuUvodVysledkyDiskusia(formDTO.getChybajuUvodVysledkyDiskusia());
        form.setNieSuUvedeneZdroje(formDTO.getNieSuUvedeneZdroje());
        form.setChybaRef(formDTO.getChybaRef());
        form.setChybaRefObr(formDTO.getChybaRefObr());
        form.setObrazkomChybaPopis(formDTO.getObrazkomChybaPopis());
        form.setPrinos(formDTO.getPrinos());
        return formRepository.save(form);
    }

    @PatchMapping("/{id}")
    public Form patchForm(@PathVariable Long id, @RequestBody FormDTO formDTO) {
        Form form = formRepository.findById(id).orElse(null);
        if (form != null) {
            if (formDTO.getReview() != null) {
                form.setReview(formDTO.getReview());
            }
            if (formDTO.getAktualnostNarocnostPrace() != null) {
                form.setAktualnostNarocnostPrace(formDTO.getAktualnostNarocnostPrace());
            }
            if (formDTO.getOrientovanieStudentaProblematike() != null) {
                form.setOrientovanieStudentaProblematike(formDTO.getOrientovanieStudentaProblematike());
            }
            if (formDTO.getChybaRef() != null) {
                form.setChybaRef(formDTO.getChybaRef());
            }
            if (formDTO.getChybaRefObr() != null) {
                form.setChybaRefObr(formDTO.getChybaRefObr());
            }
            if (formDTO.getVhodnostZvolenychMetod() != null) {
                form.setVhodnostZvolenychMetod(formDTO.getVhodnostZvolenychMetod());
            }
            if (formDTO.getRozsahUrovenDosiahnutychVysledkov() != null) {
                form.setRozsahUrovenDosiahnutychVysledkov(formDTO.getRozsahUrovenDosiahnutychVysledkov());
            }
            if (formDTO.getAnalyzaInterpretaciaVysledkov() != null) {
                form.setAnalyzaInterpretaciaVysledkov(formDTO.getAnalyzaInterpretaciaVysledkov());
            }
            if (formDTO.getPrehladnostLogickaStrukturaPrace() != null) {
                form.setPrehladnostLogickaStrukturaPrace(formDTO.getPrehladnostLogickaStrukturaPrace());
            }
            if (formDTO.getFormalnaJazykovaStylistickaUrovenPrace() != null) {
                form.setFormalnaJazykovaStylistickaUrovenPrace(formDTO.getFormalnaJazykovaStylistickaUrovenPrace());
            }
            if (formDTO.getPracaZodpovedaSablone() != null) {
                form.setPracaZodpovedaSablone(formDTO.getPracaZodpovedaSablone());
            }
            if (formDTO.getChybaNazovPrace() != null) {
                form.setChybaNazovPrace(formDTO.getChybaNazovPrace());
            }
            if (formDTO.getChybaMenoAutora() != null) {
                form.setChybaMenoAutora(formDTO.getChybaMenoAutora());
            }
            if (formDTO.getChybaPracovnaEmailovaAdresa() != null) {
                form.setChybaPracovnaEmailovaAdresa(formDTO.getChybaPracovnaEmailovaAdresa());
            }
            if (formDTO.getChybaAbstrakt() != null) {
                form.setChybaAbstrakt(formDTO.getChybaAbstrakt());
            }
            if (formDTO.getAbstraktNesplnaRozsah() != null) {
                form.setAbstraktNesplnaRozsah(formDTO.getAbstraktNesplnaRozsah());
            }
            if (formDTO.getChybajuKlucoveSlova() != null) {
                form.setChybajuKlucoveSlova(formDTO.getChybajuKlucoveSlova());
            }
            if (formDTO.getChybajuUvodVysledkyDiskusia() != null) {
                form.setChybajuUvodVysledkyDiskusia(formDTO.getChybajuUvodVysledkyDiskusia());
            }
            if (formDTO.getNieSuUvedeneZdroje() != null) {
                form.setNieSuUvedeneZdroje(formDTO.getNieSuUvedeneZdroje());
            }
            if (formDTO.getObrazkomChybaPopis() != null) {
                form.setObrazkomChybaPopis(formDTO.getObrazkomChybaPopis());
            }
            if (formDTO.getPrinos() != null) {
                form.setPrinos(formDTO.getPrinos());
            }
            return formRepository.save(form);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteForm(@PathVariable Long id) {
        formRepository.deleteById(id);
    }
}