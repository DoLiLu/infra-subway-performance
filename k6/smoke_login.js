import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

export let options = {
    vus: 1,
    duration: '10s',

    thresholds: {
        http_req_duration: ['p(99)<50'],
    },
};

const BASE_URL = 'https://dolilu.kro.kr';
const USERNAME = 'lsecret@naver.com';
const PASSWORD = 'qwe123';

export default function ()  {

    let loginRes = 로그인_요청();
    로그인_성공됨(loginRes);

    let myInfoRes = 내_정보_확인_요청(loginRes);
    내_정보_확인됨(myInfoRes);

    sleep(1);
};

export function 로그인_요청(){
    var payload = JSON.stringify({
        email: USERNAME,
        password: PASSWORD,
    });

    var params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return http.post(`${BASE_URL}/login/token`, payload, params);
}

export function 로그인_성공됨(loginRes){
    check(loginRes, {
        'logged in successfully': (resp) => resp.json('accessToken') !== '',
    });
}

export function 내_정보_확인_요청(loginRes) {
    let authHeaders = {
        headers: {
            Authorization: `Bearer ${loginRes.json('accessToken')}`,
        },
    };
    return http.get(`${BASE_URL}/members/me`, authHeaders).json();

}

export function 내_정보_확인됨(myInfoRes) {
    check(myInfoRes, { 'retrieved member': (obj) => obj.id != 0 });
}

export function 경로_조회_요청() {
    return http.get(`${BASE_URL}/paths` + "?source=1&target=2").json();
}
