import { apiInstance } from "."
import { GET_LIST_CONTAINER_PATH } from "@/constant/router"

export const getListContainerApi = () => {
    return apiInstance.get(GET_LIST_CONTAINER_PATH)
}