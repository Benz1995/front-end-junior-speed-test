const urlAPI = "https://smmdev-buyer-api.seohunter.xyz"
const loadToken = async () =>{
    $.ajax({  url: urlAPI+"/api/buyer/v1/token",  
    dataType: 'json',
    type: "POST",
    data:{
        key: "ohKznpVgJnmrSCldixDJGQcXcaZm9ZgT",
        secret_key: "qAOLED4T-mjDK0PTyJeEOAP50G5N03ITqmKy3EGI0jSRCEfvh76_4Qk9cp3UoUZP"
    },
    success: function(result){
        localStorage.setItem('token',result.token)
    }});
}
const loadProduct = async (pageNo=1,categoryID=21,showPerPage=10) =>{
    let tokenCallAPI = localStorage.getItem('token')
    $.ajax({  url: urlAPI+"/api/buyer/v1/product/list",
    type: "POST",  
    dataType: 'json',
    headers: {
        "Authorization": tokenCallAPI
    },
    data:{
        category_id: categoryID,
        page : pageNo,
        show_per_page :showPerPage
    },success: function(result){
        if(result.product_list.total_product > 0){
            generateHtml(result.product_list.product);
            generatePagination(result.product_list,categoryID,showPerPage);
        }else{
            $('#list-product').html("No Product");
        }
    }});
}

const searchProduct = async (textSearch="",pageNo=1,showPerPage=10,) =>{
    if(textSearch == ""){
        await loadProduct()
    }
    let tokenCallAPI = localStorage.getItem('token')
    $.ajax({  url: urlAPI+"/api/buyer/v1/product/search",
    type: "POST",  
    dataType: 'json',
    headers: {
        "Authorization": tokenCallAPI
    },
    data:{
        search : textSearch,
        page : pageNo,
        show_per_page :showPerPage
    },success: function(result){
        $('#list-pagination').html("");
        generateHtmlSearch(result);
        
    }});
}

const generatePagination = async (data=[],categoryID,showPerPage) =>{
    let htmlPagination = `<ul class="pagination justify-content-center">`;
    let pageNow = data.page;
    htmlPagination += ` <li class="page-item">
                            <span class="page-link">Previous</span>
                        </li>`
    for (let index = 0; index < pageNow; index++) {
        htmlPagination += ` <li class="page-item"><span class="page-link" pageno="${index+1}">${index+1}</span></li>`
    }
    htmlPagination += ` <li class="page-item">
                             <span class="page-link">Next</span>
                        </li>`
    htmlPagination += `</ul>`;
    $('#list-pagination').html(htmlPagination);
    $(".page-link").click( async function(e){
        e.preventdefault
        let getPageNo = $(e.target).attr('pageno');
        await loadProduct(getPageNo,categoryID,showPerPage);
    });
    $(".page-link-previous").click(function(e){
        let getPageNo = $(e.target).attr('pageno');
        getPageNo = getPageNo-1;
        loadProduct(getPageNo,categoryID,showPerPage);
    });
    $(".page-link-next").click(function(e){
        let getPageNo = $(e.target).attr('pageno');
        getPageNo = getPageNo+1;
        loadProduct(getPageNo,categoryID,showPerPage);
    });
}

const generateHtml = (data=[]) =>{
    let htmlProduct = ``;
    for (let key in data) {
        let pointData = data[key];
        let htmlProductStar = ``;
        let classStar =""
        for (let index = 0; index < 5; index++) {
            let avgStar = pointData.avg_star;
            if(avgStar < index+1){
                classStar = "fa-star-o"
            }else{
                classStar = "fa-star"
            }
            htmlProductStar += `<i class="fa ${classStar}" aria-hidden="true"></i>`;   
        }
        htmlProduct += `<div class="col-sm-6 col-6 col-lg-3 mb-20">
                            <div class="card" style="width: 100%;">
                                <img src="${pointData.product_image}" class="card-img-top" alt="${pointData.name}">
                                    <div class="card-body">
                                        <div id="review-star">${htmlProductStar}</div>
                                        <h5 class="card-title">${pointData.name}</h5>
                                        <p class="card-text">${pointData.shop_name}</p>
                                        <p class="card-text">ราคาปัจจุบัน</p>
                                        <p class="card-text">${pointData.weight_per_unit}/${pointData.smallest_unit_name}</p>
                                        <p class="card-text">${pointData.product_price} บาท</p>
                                    </div>
                            </div>
                        </div>`;
      }
      $('#list-product').html(htmlProduct);
}

const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random()
        * (max - min + 1)) + min;
};

const generateHtmlSearch = (data) =>{
    let htmlProduct = ``;
    console.log(data)
    let pointProducts    = data.product_list;
    let pointShopes    = data.shop_list;
    for (let key in pointProducts) {
        console.log(key)
        let randomNumber = randomNumberInRange(1,999);
        let baseUrlImg = 'https://source.unsplash.com/random?'+randomNumber
        let pointProduct    = pointProducts[key];
        console.log(pointProduct)
        console.log(pointProduct.name)
        htmlProduct += `<div class="col-sm-6 col-6 col-lg-3 mb-20">
                            <div class="card" style="width: 100%;">
                                <img src="${baseUrlImg}" class="card-img-top card-img" alt="${pointProduct.name}">
                                    <div class="card-body">
                                        <h5 class="card-title">${pointProduct.name}</h5>
                                    </div>
                            </div>
                        </div>`;

    }

    for (let key in pointShopes) {
        console.log(key)
        let randomNumber = randomNumberInRange(1,999);
        let baseUrlImg = 'https://source.unsplash.com/random?'+randomNumber
        let pointShope    = pointShopes[key];
        htmlProduct += `<div class="col-sm-6 col-6 col-lg-3 mb-20">
                            <div class="card" style="width: 100%;">
                                <img src="${baseUrlImg}" class="card-img-top card-img" alt="${pointShope.name}">
                                    <div class="card-body">
                                        <h5 class="card-title">${pointShope.name}</h5>
                                    </div>
                            </div>
                        </div>`;

    }
    $('#list-product').html(htmlProduct ? htmlProduct : "No Product");


}

$(document).ready(function(){
    // const tokenCallAPI = localStorage.getItem('token')
    // if(!tokenCallAPI){
        loadToken();   
    //}else{
        loadProduct();
    //}
    $('.slideimage').slick({
        dots: true,
        infinite: false,
        speed: 100,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
        {
            breakpoint: 1024,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
            }
        },
        {
            breakpoint: 800,
            settings: {
            slidesToShow: 2,
            slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
            slidesToShow: 1,
            slidesToScroll: 1
            }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
        ]
    });

    var setTimeOutSearch;
    $("#search-product").keyup(function(){
        let self = this
        clearTimeout(setTimeOutSearch)
        setTimeOutSearch = setTimeout( () => {
             searchProduct($(self).val())
        }, 1000);
      });
  });
