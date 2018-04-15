import axios from 'axios';

const apiServices = {};

apiServices.addUser = (user) => {
 return axios({
    method: 'POST',
    url: 'http://localhost:3000/api/DatingApp',
    data: {
      username: user.username,
      email: user.email,
      password: user.password,
      gender: user.gender,
      age: user.age,
      gender_seeking: user.gender_seeking,
      age_seeking: user.age_seeking,
      profile_id: user.profile_id
    }
  })
  console.log('apiServices has received this data -->', user)
}

apiServices.addUserPhoto = (photo) => {
 return axios({
    method: 'POST',
    url: 'http://localhost:3000/api/DatingApp/addphoto',
    data: {
      photo: photo
    }
  })
  console.log('apiServices has received this data -->', photo)
}

export default apiServices;