
package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.Form.Form;
import ukf.backend.Model.Form.FormRepository;

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

    @PostMapping
    public Form createForm(@RequestBody Form form) {
        return formRepository.save(form);
    }

    @GetMapping("/{id}")
    public Form getFormById(@PathVariable Long id) {
        return formRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Form updateForm(@PathVariable Long id, @RequestBody Form formDetails) {
        Form form = formRepository.findById(id).orElse(null);
        if (form != null) {
            form.setReview(formDetails.getReview());
            return formRepository.save(form);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteForm(@PathVariable Long id) {
        formRepository.deleteById(id);
    }
}