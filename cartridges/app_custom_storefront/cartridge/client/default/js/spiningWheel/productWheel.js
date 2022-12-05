'use strict';


function getSpinnerProduct() {

    var productURL = $('#getProductUrl').val();
    // console.log(productURL1);
    // console.log("Before API call");


    //         $('#editWishlistProductModal').spinner().start();

    $.ajax({
        url: productURL,
        // url: (productURL1 + "?" + "spinObj=" + dataValue),
        type: 'get',
        context: this,
        // data: spinObj,
        // dataType: 'json',
        success: function (data) {
            if (data.success) {
                console.log("helloo");
                console.log(data);
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
                                <a class="action-link add-to-cart w-100 text-center checkShare" title="Share">
                                <span class="fa fa-share-alt" aria-hidden="true"></span>
                                <span class=""></span>
                            </a>
                                <a class="action-link add-to-cart w-100 text-center checkDelete deleteProduct" title="Delete">
                                <span class="fa fa-trash-o" aria-hidden="true"></span>
                                <input type="hidden" class="removeProductID" id="removeProductID${item}" value="${data.product_item[item].product_id}"/>
                                 
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
                url: productURL,
                type: 'post',
                data: spinObj,
                dataType: 'json',
                // contentType: "application/json", 
                context: this,
                success: function (data) {
                    console.log("getting products");
                    if (data.success) {
                        getSpinnerProduct();
                        // $('#btn-accept').trigger();
                    }

                },

                error: function (error) {
                    console.log("In error");
                    console.log(error);
                }
            });
        });

    },



    removeSelectedItem: function () {

        $(document).on('click', '.deleteProduct', function (e) {
            var indexx = $(this).parent().parent().index();
            console.log(indexx);
            var deleteProduct = $(`#removeProductID${indexx}`).val();
            console.log(deleteProduct);
            // $('#product-table tr').index($(this).closest('tr'));
            // $( e.target ).closest( "#tablesss" );
            e.preventDefault();
            console.log("changed");

            var removeProductURL = $('#removeProductUrl').val();
            console.log(removeProductURL);

            // var deleteProduct = $('#earnedItems').val();
            // console.log(deleteProduct);
            console.log("inside deleleeete");

            $.ajax({
                url: removeProductURL,
                type: 'post',
                context: this,
                data: { deleteProduct },
                dataType: 'json',
                success: function (data) {
                    console.log("in success");
                    console.log(data);
                    if (data.success) {
                        getSpinnerProduct();
                        // $('#btn-accept').trigger();
                    }

                },

                error: function (error) {
                    console.log("In error");
                    console.log(error);
                }
            });
        });

    }
}
