'use strict';

module.exports = {
    addSpinnerProduct: function () {
        $('#btn-accept').on('click',function (e) {
            e.preventDefault();

            var dataValue = $('#selectedProduct').val();
            var spinObj = JSON.parse(dataValue);

            console.log(spinObj)

            var productURL = $('#addProductUrl').val();
            console.log(productURL);
            console.log("Before API call");


    //         $('#editWishlistProductModal').spinner().start();

            $.ajax({
                // url: productURL,
                url: (productURL + "?" + "spinObj=" + dataValue),
                type: 'post',
                context: this,
                data: spinObj,
                dataType: 'json',
                success: function (data) {
                    console.log("In success");
                    console.log(data);

                 
                },
                error: function (error) {
                    console.log("In error");
                    console.log(error);

                  
                    
                }
            });
        });
    },

    getSpinnerProduct: function () {
        $('#btn-decline').on('click',function (e) {
            e.preventDefault();

            var dataValue = $('#selectedProduct').val();
            var spinObj = JSON.parse(dataValue);

            console.log(spinObj)

            var productURL1 = $('#getProductUrl').val();
            console.log(productURL1);
            console.log("Before API call");


    //         $('#editWishlistProductModal').spinner().start();

            $.ajax({
                // url: productURL,
                url: (productURL1 + "?" + "spinObj=" + dataValue),
                type: 'get',
                context: this,
                data: spinObj,
                dataType: 'json',
                success: function (data) {
                    console.log("In success");
                    console.log(data);

                 
                },
                error: function (error) {
                    console.log("In error");
                    console.log(error);

                  
                    
                }
            });
        });
    },



}