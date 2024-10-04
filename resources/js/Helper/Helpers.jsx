export const buildSearchParams = ({limit = 10, page = 1, sort = "desc", sortBy = "id", searchTerm = "", gender = ""}) => {
    let url = "";
    const params = new URLSearchParams();
    if(limit) {
        params.append('limit', limit == null ? 10 : limit);
    }
    if(page) {
        params.append('page', page == null ? 1 : page);
    }
    if(sort) {
        params.append('sort', sort == null ? "desc" : sort);
    }
    if(sortBy) {
        params.append('sortBy', sortBy == null ? "id" : sortBy);
    }
    if(searchTerm) {
        params.append('search', searchTerm == null ? "" : searchTerm);
    }
    if (gender) {
        params.append("gender", false ? "" : gender);
    }
    if(params.toString()) {
        url += `${params.toString()}`;
    }

    return url;
}
