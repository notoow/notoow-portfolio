import { normalizeYouTubeThumbnail } from '../lib/youtubeThumbnails';

export const portfolioVideoMode = 'manual';

const portfolioVideos = {
    디자인: [
        {
            title: "고양시지속가능발전협의회 홍보영상",
            url: "https://youtu.be/rQkWrjpCgKs",
            section: "motion",
            type: "YouTube Unlisted",
            thumbnail: "https://i.ytimg.com/vi/rQkWrjpCgKs/hqdefault.jpg",
        },
        {
            title: "롯데홈쇼핑 바로알기 | 이천 자동화 물류센터",
            url: "https://www.youtube.com/watch?v=Iv8xAVWP-Ds",
            section: "motion",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/Iv8xAVWP-Ds/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFQgXihlMA8=&rs=AOn4CLAMKpuJS_AA03T8RIq0S2ut2DTVJQ",
        },
        {
            title: "캐릭터 립싱크 | 조선멤버스 취준생 면접 필승 전략",
            url: "https://www.youtube.com/watch?v=Qcezswtg2yU",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/Qcezswtg2yU/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLCxlnYrdWUDwUCg1HQENiO1kQv0sQ",
        },
        {
            title: "국회 국집소 예능 영상 2",
            url: "https://www.youtube.com/watch?v=KwJkwZOR1f4",
            section: "edit",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/KwJkwZOR1f4/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEEgZShTMA8=&rs=AOn4CLCpXn4rN2Cgg2V_U9Id6YbciYFCWQ",
        },
        {
            title: "국회 어쩌다인턴 예능 영상 1",
            url: "https://www.youtube.com/watch?v=UU7XzIeqlK0",
            section: "edit",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/UU7XzIeqlK0/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgWShWMA8=&rs=AOn4CLDmS-zYPw7Prawm4SwyVcn__vf1Aw",
        },
        {
            title: "가정의학과 자막 디자인",
            url: "https://www.youtube.com/watch?v=j4O7CKTEONI",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/j4O7CKTEONI/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLD4LD8UqgDSbXn5mKLtj4n0wAPqTA",
        },
        {
            title: "구슬 애착인형 경연대회",
            url: "https://www.youtube.com/watch?v=RZ2EzlKigqo",
            section: "edit",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/RZ2EzlKigqo/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLCUhS1GCqb_ZOAbrwugXuVfLiYpeQ",
        },
        {
            title: "여행 영상",
            url: "https://www.youtube.com/watch?v=SvZ5ECeT53g",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/SvZ5ECeT53g/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgYChNMA8=&rs=AOn4CLDTStLoBu33XdeC8E3WJtv22JB_DQ",
        },
        {
            title: "미국대학입시컨설팅 인트로",
            url: "https://www.youtube.com/watch?v=IHwd8zO2KRk",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/IHwd8zO2KRk/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGCwgVSh_MA8=&rs=AOn4CLBwqhwSa8rdAwKfnZ2U732joKgMow",
        },
        {
            title: "도깨비 동화 1",
            url: "https://www.youtube.com/watch?v=dZg5tkabopg",
            section: "ai",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/dZg5tkabopg/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgYSg5MA8=&rs=AOn4CLCE_XG8-MrhGXRQCDf6RtlXAZOB2A",
        },
        {
            title: "도깨비 동화 2",
            url: "https://www.youtube.com/watch?v=XCxamMM_7vM",
            section: "ai",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/XCxamMM_7vM/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgYShFMA8=&rs=AOn4CLAbEDttGnAUXHSRR7fwsp2r-oZWog",
        },
        {
            title: "한줄 유튜브 인트로",
            url: "https://www.youtube.com/watch?v=jENZhdkI9RY",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/jENZhdkI9RY/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGMgYyhjMA8=&rs=AOn4CLCcaV1JqwxXhrOnIK4vujRF1WkRKQ",
        },
        {
            title: "크립토 차트",
            url: "https://www.youtube.com/watch?v=tSYy9GYdmRc",
            section: "edit",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/tSYy9GYdmRc/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgPihTMA8=&rs=AOn4CLCTuSVF1cgGwc1qsI928ZHcVADZLw",
        },
        {
            title: "여행 인트로",
            url: "https://www.youtube.com/watch?v=maM5_DQNwgI",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/maM5_DQNwgI/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGD4gVShlMA8=&rs=AOn4CLA9pVjRVK03xjjooqxP4ogwVkwLFw",
        },
        {
            title: "이수근채널 당구 자막 디자인",
            url: "https://www.youtube.com/watch?v=g-qCZq67cbE",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/g-qCZq67cbE/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFUgYShlMA8=&rs=AOn4CLBzEeoW5pm6PvryQGkpAPllx6nFCA",
        },
        {
            title: "탐정채널 인트로영상",
            url: "https://www.youtube.com/watch?v=1YZOO9pLbQY",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/1YZOO9pLbQY/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGD8gVChyMA8=&rs=AOn4CLChlES8mtZF-KGRE2JsxSuI-b1viQ",
        },
        {
            title: "비뇨기과산부인과 자막 디자인",
            url: "https://www.youtube.com/watch?v=LIX9c_AlvAA",
            section: "design",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/LIX9c_AlvAA/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEQgSihlMA8=&rs=AOn4CLBbjhpMwdw7YmN3XmHwYM7L-f_Ryg",
        },
    ],
    '3D': [
        {
            title: "멀티탭 홍보영상",
            url: "https://www.youtube.com/watch?v=Cjg20fAQUSI",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/Cjg20fAQUSI/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLDzmwPeLVr7H_84Ts_2knWv9EozSQ",
        },
        {
            title: "수경재배기구 제품 홍보",
            url: "https://www.youtube.com/watch?v=Je54gM1ccDw",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/Je54gM1ccDw/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGD4gZSg-MA8=&rs=AOn4CLB07Nb_k1fpOn8jMz8-5Xpt-LVrVA",
        },
        {
            title: "세코어 로보스틱스 IR 피치영상",
            url: "https://www.youtube.com/watch?v=CH1klZAl9rA",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/CH1klZAl9rA/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgYChGMA8=&rs=AOn4CLAvlV1xXTEjHbPJiIrAZiAnxHaFKw",
        },
        {
            title: "웨딩 반지 서핑 홍보 영상",
            url: "https://www.youtube.com/watch?v=PmSm9-_y7O4",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/PmSm9-_y7O4/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFogZChlMA8=&rs=AOn4CLBdtttQ6VRIRCo6bxodqoyKIgXujw",
        },
        {
            title: "비타민 제품 홍보",
            url: "https://www.youtube.com/watch?v=cgeUUyAz7R0",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/cgeUUyAz7R0/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDEgXyhlMA8=&rs=AOn4CLDwsE3heHCXhrBT75nAnkwJyjHvPw",
        },
        {
            title: "웨딩 반지 별 홍보 영상",
            url: "https://www.youtube.com/watch?v=aWt8RAiKP3w",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/aWt8RAiKP3w/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGE8gYihlMA8=&rs=AOn4CLBq2VALX5fSOqa29vpbFQynWKKcVQ",
        },
        {
            title: "3단 폴대 박람회영상",
            url: "https://www.youtube.com/watch?v=AyYL5E7OIu8",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/AyYL5E7OIu8/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFEgWyhlMA8=&rs=AOn4CLDdStvZgusAKdab3R1wgIFk6B4a7g",
        },
        {
            title: "공기청정기 홍보영상",
            url: "https://www.youtube.com/watch?v=iGGFvrpeRr8",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/iGGFvrpeRr8/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGIgYihiMA8=&rs=AOn4CLBWOkQRWquRWrHGGzaVaBa8WWQjtA",
        },
        {
            title: "카포트 홍보영상",
            url: "https://www.youtube.com/watch?v=eweX-SA06Ss",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/eweX-SA06Ss/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEogXChlMA8=&rs=AOn4CLDiONDjHo_YVtAotiGH8Z6iyZDi3A",
        },
        {
            title: "스마트블라인드 홍보영상",
            url: "https://www.youtube.com/watch?v=KKQbx8WNG68",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/KKQbx8WNG68/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLBP0-2zap03z4DwOTZGsFRQuBKeyA",
        },
        {
            title: "노인케어로봇 홍보영상",
            url: "https://www.youtube.com/watch?v=9L5D72ZVLrc",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/9L5D72ZVLrc/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGIgYihiMA8=&rs=AOn4CLD-VmkeOBX7cWILhp8017l0TCJSbQ",
        },
        {
            title: "발각질제거기 홍보영상",
            url: "https://www.youtube.com/watch?v=VOTU-8623Co",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/VOTU-8623Co/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGH8gISgiMA8=&rs=AOn4CLDu6Bwv31ZACGwHQ9gqsUCFqcqDCg",
        },
        {
            title: "파레트밴드 홍보영상",
            url: "https://www.youtube.com/watch?v=URX0C7XdF0g",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/URX0C7XdF0g/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgXChDMA8=&rs=AOn4CLA4v3Nq5B5t25pKeBkwUOnfMH4Miw",
        },
        {
            title: "Fitbot 안마기 홍보영상",
            url: "https://www.youtube.com/watch?v=F2Fr5sdQDfE",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/F2Fr5sdQDfE/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEEgVyhyMA8=&rs=AOn4CLDrxvI2qRSy4vGGswIbL2G4aaDiOg",
        },
    ],
    예능: [
        {
            title: "박성웅 유딱날 2",
            url: "https://www.youtube.com/watch?v=vomJJrpoT1k",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/vomJJrpoT1k/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgVihAMA8=&rs=AOn4CLCjAlU2yZP0NUA13ZmtVbjFpVUrBQ",
        },
        {
            title: "박성웅 유딱날 1",
            url: "https://www.youtube.com/watch?v=6ZuUQpCjfN0",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/6ZuUQpCjfN0/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgUyhHMA8=&rs=AOn4CLA-xr7dRtTxPfOSnhubQLUxJMFnUQ",
        },
        {
            title: "첨단보석연구소 공개합니다 | VVS 시금법 랩그로운 다이아",
            url: "https://www.youtube.com/watch?v=jCedoH9wStg",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/jCedoH9wStg/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFYgZShkMA8=&rs=AOn4CLBelgwt7Z1DXSmL2xQ_IiNVuyQLew",
        },
        {
            title: "현대 연구성과 교류회",
            url: "https://www.youtube.com/watch?v=tVDkecL1Vxw",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/tVDkecL1Vxw/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFIgWyhlMA8=&rs=AOn4CLBBniXA_e696lNF_ePpFVUD641mhw",
        },
        {
            title: "K리그 퓨처스 리프팅편",
            url: "https://www.youtube.com/watch?v=tTAv8yObdJ4",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/tTAv8yObdJ4/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGC8gZSgpMA8=&rs=AOn4CLAage-S7YK9s0rrp-terzchCZslnQ",
        },
        {
            title: "현대엔지비 연구장학생 현대모터스튜디오 견학",
            url: "https://www.youtube.com/watch?v=Z475UoAV4s4",
            type: "YouTube Unlisted",
            thumbnail: "https://i9.ytimg.com/vi/Z475UoAV4s4/mqdefault.jpg?sqp=CIyK5s0G-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGF8gXyhfMA8=&rs=AOn4CLDITFzn158CZq2t8u82urmVkzxVPw",
        },
    ],
};

function extractVideoId(input) {
    const s = String(input || '').trim();
    if (!s) return '';
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;

    const patterns = [
        /[?&]v=([A-Za-z0-9_-]{11})/,
        /youtu\.be\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = s.match(pattern);
        if (match?.[1]) return match[1];
    }

    return '';
}

function resolveThumbnail(thumbnail, videoId) {
    return normalizeYouTubeThumbnail(thumbnail, videoId);
}

export function getPortfolioVideosByCategory(categoryTag) {
    const items = portfolioVideos[categoryTag];
    if (!Array.isArray(items)) return [];

    return items
        .map((item, index) => {
            const title = String(item?.title || '').trim();
            const desc = String(item?.desc || item?.description || '').trim();
            const thumbnail = String(item?.thumbnail || item?.thumbnailUrl || '').trim();
            const rawUrl = String(item?.url || '').trim();
            const rawVideoId = String(item?.videoId || item?.video_id || '').trim();
            const videoId = extractVideoId(rawVideoId || rawUrl);
            const url = rawUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');
            const type = String(item?.type || 'YouTube Unlisted').trim();
            const hasContent = Boolean(title || desc || thumbnail || url || videoId);

            if (!hasContent) return null;

            return {
                videoId,
                title: title || `Untitled ${index + 1}`,
                type,
                desc,
                thumbnail: resolveThumbnail(thumbnail, videoId),
                url,
                section: String(item?.section || '').trim(),
            };
        })
        .filter(Boolean);
}

export default portfolioVideos;
