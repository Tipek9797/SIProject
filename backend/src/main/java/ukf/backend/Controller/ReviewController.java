package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ukf.backend.Model.Article.Article;
import ukf.backend.Model.Article.ArticleRepository;
import ukf.backend.Model.Review.Review;
import ukf.backend.Model.Review.ReviewRepository;
import ukf.backend.dtos.ReviewDTO;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<String> createReview(@RequestBody ReviewDTO reviewDTO) {
        if (reviewDTO.getArticleId() == null) {
            return ResponseEntity.badRequest().body("Article ID must not be null");
        }

        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setAccepted(reviewDTO.isAccepted());

        Optional<Article> findArticle = articleRepository.findById(reviewDTO.getArticleId());
        if (findArticle.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid article ID");
        }
        review.setArticle(findArticle.get());

        reviewRepository.save(review);
        return ResponseEntity.ok("Review created");
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateReview(@PathVariable Long id, @RequestBody ReviewDTO reviewDTO) {
        Optional<Review> findReview = reviewRepository.findById(id);
        if (findReview.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review review = findReview.get();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setAccepted(reviewDTO.isAccepted());

        if (reviewDTO.getArticleId() != null) {
            Optional<Article> findArticle = articleRepository.findById(reviewDTO.getArticleId());
            if (findArticle.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid article ID");
            }
            review.setArticle(findArticle.get());
        }

        reviewRepository.save(review);
        return ResponseEntity.ok("Review updated");
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
    }
}