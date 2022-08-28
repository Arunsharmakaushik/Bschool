const DEV1 = "http://dev5.csdevhub.com/campustalk/api/";
const DEV2 = "http://52.2.140.19:8000/api/";

export const IMAGE_URL = 'http://dev5.csdevhub.com/campustalk/storage/app/public/user_images/';
export const EVENT_IMAGE_URL = 'http://dev5.csdevhub.com/campustalk/storage/app/public/event_images/';
export const ITEM_IMAGE_URL = 'http://dev5.csdevhub.com/campustalk/storage/app/public/item_images/';
export const POST_IMAGE_URL = 'http://dev5.csdevhub.com/campustalk/storage/app/public/post_images/';
export const THUMBNAIL_URL = 'http://dev5.csdevhub.com/campustalk/storage/app/public/user/getstream/thumbnails/';
// http://dev5.csdevhub.com/campustalk/storage/app/public/user/getstream/thumbnails
export const RESUME_URL = 'http://dev5.csdevhub.com/campustalk/storage/app/public/user_resume/';
export const DEFAULT_GROUP_IMG = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/friends-group-1856977-1573846.png';
let BASE_URL = DEV1;
export const SHARE_IMAGES_URL = 'https://dev5.csdevhub.com/campustalk/storage/app/public/school_images/';
export const SCHOOL_URL = "https://dev5.csdevhub.com/campustalk/storage/app/public/school_images/"

export default
    {
        GET_SCHOOL_NAMES: BASE_URL + "school",
        GET_JOB_NAMES: BASE_URL + "job",
        GET_INTEREST_NAMES: BASE_URL + "interest",
        REGISTER: BASE_URL + 'register',
        EMAIL_VERIFY: BASE_URL + 'email/verify',
        RESEND_OTP: BASE_URL + 'email/resend',
        LOGIN: BASE_URL + 'login',
        FINAL_REGISTRATION: BASE_URL + 'user',
        REFRESH_TOKEN: BASE_URL + 'refreshtoken',
        TERM_CONDITION: BASE_URL + 'cms/terms',
        GET_POSTS: BASE_URL + 'post',
        LOGOUT: BASE_URL + 'logout',
        LIKE: BASE_URL + 'post/',
        GET_COMMENTS: BASE_URL + 'post/',
        SEARCH: BASE_URL + 'post?keyword=',
        GET_USER_LIST: BASE_URL + 'user/list',
        FAVOURITES: BASE_URL + 'channel/favorite',
        ADD_CHANNEL: BASE_URL + 'channel',
        GET_SCHOOL_USER_LIST: BASE_URL + 'user/',
        GET_CHANNEL_LISTS_NIN: BASE_URL + 'user/groups',
        UPLOAD_THUMBNAIL: BASE_URL + 'user/uploads/chat/thumbnail',
        GET_CATEGORY: BASE_URL + 'user/category',
        LATLONGURL: 'https://maps.googleapis.com/maps/api/geocode/json?place_id=',
        POST_EVENT: BASE_URL + 'event/add',
        GET_SCHOOL_EVENT_LIST: BASE_URL + 'event/list',
        GET_EVENT_COMMENTS: BASE_URL + 'event/comment/',
        DO_EVENT_COMMENT: BASE_URL + 'event/comment',
        JOIN_EVENT: BASE_URL + 'event/join',
        EVENT_DETAIL: BASE_URL + 'event/',
        ADD_ITEM_TO_SELL: BASE_URL + 'items/add',
        GET_SELLING_ITEM_LIST: BASE_URL + 'items',
        GET_SEARCH_ITEM_LIST: BASE_URL + 'items/search/',
        SELLING_ITEM_DETAIL: BASE_URL + 'items/',
        MY_SELLING_ITEMS: BASE_URL + 'items/self/list',
        SOLD_OUT: BASE_URL + 'items/sold/',
        EDIT_SELLING_ITEM: BASE_URL + 'items/',
        ADD_ROOMMATE: BASE_URL + 'roommate/add',
        GET_ROOMMATES: BASE_URL + 'roommate',
        GET_TOPICS: BASE_URL + 'topic',
        ADD_TOPIC: BASE_URL + 'contactus/add',
        DELETE_ITEM: BASE_URL + 'items/',
        GET_SAME_SCHOOL_MEMBERS: BASE_URL + 'user/',
        GET_HOME_STATES: BASE_URL + 'state',
        GET_UNDERGRAD: BASE_URL + 'under/graduation/school',
        GOING_IN_EVENT: BASE_URL + 'event/going/',
        UPLOAD_POST: BASE_URL + 'post/add',
        SEARCH_UNDERGRAD: BASE_URL + 'under/graduation/school/search/',
        GET_USER_DETAIL: BASE_URL + 'user/other/',
        SET_NOTIFICATION: BASE_URL + 'user/update/setting',
        SEARCH_USER: BASE_URL + 'user/search',

    };
