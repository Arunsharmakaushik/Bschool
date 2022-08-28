import axios from 'axios';
import { identifyUserWithEmail } from 'instabug-reactnative';
import EndPoints from './EndPoints';

const Actions = {

	GetSchoolNames: (page) => {
		return axios.get(EndPoints.GET_SCHOOL_NAMES+'?page='+page, {
		});
	},

	GetJobNames: () => {
		return axios.get(EndPoints.GET_JOB_NAMES, {
		});
	},

	GetInterestNames: () => {
		return axios.get(EndPoints.GET_INTEREST_NAMES, {
		});
	},

	Register: (data) => {
		console.log(data.data);
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Accept': 'application/json',
		};
		return axios.post(EndPoints.REGISTER, data.data, { headers });
	},

	Email_Verify: (data) => {
		console.log(EndPoints.EMAIL_VERIFY)
		return axios.post(EndPoints.EMAIL_VERIFY, data);
	},

	Resend_Otp: (data) => {
		return axios.post(EndPoints.RESEND_OTP, data);
	},

	Login: (data) => {
		return axios.post(EndPoints.LOGIN, data);
	},

	Final_Registration: (data) => {
		console.log('final'+JSON.stringify(data));
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};

		return axios.put(EndPoints.FINAL_REGISTRATION, data.data, { headers });
	},

	ProfileStatus: (data) => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.get(EndPoints.FINAL_REGISTRATION, { headers });
	},


	Update: (data) => {
		console.log(data);
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.put(EndPoints.FINAL_REGISTRATION, data.data, { headers });
	},


	GetTermCondition: () => {
		return axios.get(EndPoints.TERM_CONDITION, {
		});
	},


	GetPosts: (data) => {
		console.log('#token', data.token)
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};

		return axios.get(EndPoints.GET_POSTS, { headers });
	},

	Refresh_Token: (data) => {
		// console.log("old REFRESH_TOKEN : " + data.oldToken + "\nold token " + data.token);
		let oldToken = data.token;
		let oldAccessToken = data.oldToken;
		axios.defaults.headers.common = {
			'Refreshtoken': oldToken,
			'Authorization': 'Bearer ' + oldAccessToken,
		};
		return axios.post(EndPoints.REFRESH_TOKEN,);
	},

	ProfileUpdate: (data) => {
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + data.token,
		};
		return axios.post(EndPoints.FINAL_REGISTRATION, data.data, { headers });
	},


	Logout: (token) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		return axios.post(EndPoints.LOGOUT);
	},

	Like: (data) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		let url = EndPoints.LIKE + data.id + '/like'
		console.log(data.data);
		return axios.put(url, data.data);
	},

	Get_Comments: (data) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		let url = EndPoints.GET_COMMENTS + data.id + '/comment'+'?page='+data.page;
		return axios.get(url);
	},

	Do_Comment: (data) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		let url = EndPoints.GET_COMMENTS + data.id + '/comment'
		return axios.post(url, data.data);
	},

	Search: (data) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		let url = EndPoints.SEARCH + data.text
		return axios.get(url);
	},

	GetUserList: (token,page) => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
			'Accept': 'application/json',
		};
		return axios.get(EndPoints.GET_USER_LIST+'?page='+page, { headers });
	},

	Favourite: (data) => {

		const headers = {
			'Content-Type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + data.token,
		};
		return axios.post(EndPoints.FAVOURITES, data.data, { headers });
	},

	FavouriteList: (data) => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.get(EndPoints.FAVOURITES, { headers });
	},

	AddChannel: (data) => {
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.post(EndPoints.ADD_CHANNEL, data.data, { headers });
	},

	UpdateChannel: (data) => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.post(EndPoints.ADD_CHANNEL + '/' + data.id, data.data, { headers });
	},

	GetSchoolUserList: (token, schoolId) => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
			'Accept': 'application/json',
		};
		let url = EndPoints.GET_SCHOOL_USER_LIST + schoolId + '/list'
		console.log(url)
		return axios.get(url, { headers });
	},

	GetChannelListNin: (data) => {
		const headers = {
			'Authorization': 'Bearer ' + data.token,
		};
		return axios.get(EndPoints.GET_CHANNEL_LISTS_NIN, { headers });
	},

	UpoadThumbnail: (data) => {
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.post(EndPoints.UPLOAD_THUMBNAIL, data.data, { headers });
	},

	GetCategory: (token) => {
		const headers = {
			'Authorization': 'Bearer ' + token,
		};
		return axios.get(EndPoints.GET_CATEGORY, { headers });
	},

	GetLatLong: (id) => {
		return axios.get(EndPoints.LATLONGURL + id + '&key=' + 'AIzaSyAL-QyTSE5ZCtvz4ITkUzg_XkILhFdbmYU');
	},

	PostEvents: (data) => {
		console.log(JSON.stringify(data))
		// console.log(EndPoints.POST_EVENT)
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Accept': 'application/json',
		};
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		return axios.post(EndPoints.POST_EVENT, data.data, { headers });
	},

	GetSchoolEventList: (data) => {
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Accept': 'application/json',
		};
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		console.log('data '+JSON.stringify(data.data))
		return axios.post(EndPoints.GET_SCHOOL_EVENT_LIST, data.data, { headers });
	},

	GetEventComments: (token, eventId) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		return axios.get(EndPoints.GET_EVENT_COMMENTS + eventId);
	},

	DoEventComment: (data) => {
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.post(EndPoints.DO_EVENT_COMMENT, data.data, { headers });
	},

	JoinEvent: (data) => {
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.post(EndPoints.JOIN_EVENT, data.data, { headers });
	},

	GetEventDetail: (token, eventId) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		return axios.get(EndPoints.EVENT_DETAIL+eventId)
	},
	AddItemToSell: (data) => {
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};
		return axios.post(EndPoints.ADD_ITEM_TO_SELL,data.data,{headers})
	},

	GetSellingItemList: (token) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		return axios.get(EndPoints.GET_SELLING_ITEM_LIST);
	},
	GetSearchItemList: (token,searchName) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		let url = EndPoints.GET_SEARCH_ITEM_LIST + searchName;

		return axios.get(url);
	},

	GetSellingItemDetail: (token,id) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		let url = EndPoints.SELLING_ITEM_DETAIL+id;
		return axios.get(url);
	},
	GetMySellingItems: (token) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		let url = EndPoints.MY_SELLING_ITEMS;
		return axios.get(url);
	},
	
	Sold_Out: (token,id) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		let url = EndPoints.SOLD_OUT+id;
		return axios.get(url);
	},
	
	EditSellingItem: (data) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		let url = EndPoints.EDIT_SELLING_ITEM+data.id+'/update';
		return axios.post(url,data.data);
	},
	AddRoomate: (data) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		let url = EndPoints.ADD_ROOMMATE;
		return axios.post(url,data.data);
	},
	
	GetRoommateData: (token) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		let url = EndPoints.GET_ROOMMATES;
		return axios.get(url);
	},

	GetTopics: (token) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + token,
		}
		let url = EndPoints.GET_TOPICS;
		return axios.get(url);
	},

	AddTopic: (data) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		let url = EndPoints.ADD_TOPIC;
		return axios.post(url,data.data);
	},

	DeleteItem: (data) => {
		axios.defaults.headers.common = {
			'Authorization': 'Bearer ' + data.token,
		}
		let url = EndPoints.DELETE_ITEM+data.id;
		return axios.delete(url);
	},

	GetSameSchoolMembers: (token, schoolId) => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
			'Accept': 'application/json',
		};
		let url = EndPoints.GET_SAME_SCHOOL_MEMBERS + schoolId + '/member'
		console.log(url)
		return axios.get(url, { headers });
	},

	GetStates: (page) => {
		let url = EndPoints.GET_HOME_STATES+'?page='+page
		console.log(url)
		return axios.get(url);
	},

	GetUndergrad: (page) => {
		let url = EndPoints.GET_UNDERGRAD+'?page='+page
		console.log(url)
		return axios.get(url);
	},

	GoingInEvent: (token,id,status) => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
			'Accept': 'application/json',
		};

		let url = EndPoints.GOING_IN_EVENT+id+'/'+status
		console.log(url)
		return axios.get(url,{headers});
	},
	UploadPost: (data) => {
	
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};

		return axios.post(EndPoints.UPLOAD_POST, data.data, { headers });
	},

	SearchUndergrad: (text,page) => {
		let url = EndPoints.SEARCH_UNDERGRAD+text+'?page='+page
		console.log(url)
		return axios.get(url);
	},

	GetUserDetails: (token,UserId) => {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
			'Accept': 'application/json',
		};
		let url = EndPoints.GET_USER_DETAIL + UserId
	
		return axios.get(url, { headers });
	},
	updateNotificationSetting: (mainData) => {
	  console.log(mainData)
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + mainData.myTokens,

		};
		return axios.put(EndPoints.SET_NOTIFICATION, mainData.data, { headers });
	},
	searchUser: (data) => {
	
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + data.token,
			'Accept': 'application/json',
		};

		return axios.post(EndPoints.SEARCH_USER, data.data, { headers });
	},

};

export default Actions;
