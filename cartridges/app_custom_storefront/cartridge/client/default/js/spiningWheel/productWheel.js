'use strict';

module.exports = {
    addSpinnerProduct: function () {
        $('#btn-accept').on('click', function (e) {
            e.preventDefault();

            var dataValue = $('#selectedProduct').val();
            var spinObj = JSON.parse(dataValue);
            console.log(spinObj);


            var productURL = $('#addProductUrl').val();


            //         $('#editWishlistProductModal').spinner().start();

            $.ajax({
                // url: productURL,
                url: (productURL + "?" + "spinObj=" + dataValue),
                type: 'post',
                context: this,
                success: function (data) {
                    console.log("getting products");
                    getSpinnerProduct();
                },

                error: function (error) {
                    console.log("In error");
                    console.log(error);
                }
            });
        });

        function getSpinnerProduct() {
            // $('#btn-decline').on('click', function (e) {
            //     e.preventDefault();

            var dataValue = $('#selectedProduct').val();
            var spinObj = JSON.parse(dataValue);

            // console.log(spinObj)

            var productURL1 = $('#getProductUrl').val();
            // console.log(productURL1);
            // console.log("Before API call");


            //         $('#editWishlistProductModal').spinner().start();

            $.ajax({
                // url: productURL,
                url: (productURL1 + "?" + "spinObj=" + dataValue),
                type: 'get',
                context: this,
                data: spinObj,
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        var tabledata = $('.tableSet');
                        tabledata.empty();
                        if (data.product_item.length === 0) {

                            tabledata.append("<p>Please add data in table</p>");

                        }
                        else {
                            var content = "";
                            content = content.concat(`
                                <table class="table table-striped" id="product-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Expiry Date</th>
                                        <th>Status</th>
                                        <th>Share</th>
                    
                                    </tr>
                                </thead>
                                <tbody>
                                `)

                            for (const item in data.product_item) {
                                console.log(item);
                                content = content.concat(`
                                    <tr>
                                    <td>${data.product_item[item].product_name}</td>
                                    <td>${data.product_item[item].product_expiry}</td>
                                    <td>${data.product_item[item].product_status}</td>
                                    <td>
                                        <a class="action-link add-to-cart w-100 text-center checkAddtoCart">
                                            <span class="fa fa-shopping-cart" aria-hidden="true"></span>
                                            <span class="">ADD TO CART</span>
                                        </a>
                                        <a class="action-link add-to-cart w-100 text-center checkShare">
                                            <span class="fa fa-share-alt" aria-hidden="true"></span>
                                            <span class="">SHARE</span>
                                        </a>
                                    </td>
                                </tr>
                                    
                                    `)
                            }
                            content = content.concat(`
                                </tbody>
                                </table>
                                
                                `)
                            console.log("anber");
                            console.log(data);
                            tabledata.append(content);

                        }

                    }
                    // console.log("In success");
                    // console.log(data);
                    // console.log("abc");
                    // console.log(data.product_item);


                },
                error: function (error) {
                    console.log("In error");
                    console.log(error);
                }
            });
        };

    },

    declineSelectedProduct: function () {
        $('#btn-decline').on('click', function (e) {
            e.preventDefault();

            console.log("before");

            $('#selectedProduct').hide();

            console.log("after");

        
        });
    }

}