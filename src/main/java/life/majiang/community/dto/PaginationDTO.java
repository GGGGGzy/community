package life.majiang.community.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PaginationDTO {
    private List<QuestionDTO> questions;
    private Boolean showPrevious;
    private Boolean showFirstPage;
    private Boolean showNext;
    private Boolean showEndPage;
    private Integer currentPage;
    private Integer totalPage;
    private List<Integer> pages;

    public void setPagination(Integer totalCount, Integer page, Integer size) {
        totalPage = (totalCount / size) + (totalCount % size == 0 ? 0 : 1);
        if (page < 1)
            page = 1;
        if (page > totalPage)
            page = totalPage;
        currentPage = page;
        pages = new ArrayList<>(size);
        pages.add(page);
        for (int i = 1; i <= 3; i++) {
            if (page - i > 0) {
                pages.add(0, page - i);
            }
            if (page + i <= totalPage) {
                pages.add(page + i);
            }
        }
        showPrevious = (page != 1);
        showNext = (page != totalPage);
        showFirstPage = (!pages.contains(1));
        showEndPage = (!pages.contains(totalPage));
    }
}
