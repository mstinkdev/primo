import $axios from "axios"
import fetchAdapter from "@haverstack/axios-fetch-adapter";

const axios = $axios.create({
    adapter: fetchAdapter,
});

export default axios

export const USER_AGENT = {
    "User-Agent": "primocms.org",
};