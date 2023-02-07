'use strict';

const { error } = require("jquery");


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
                                    <input type="hidden" class="addToCartID" id="addToCartID${item}"
                                    value="${data.product_item[item].product_id}"/>
                                </a>
                                <a class="action-link add-to-cart w-100 text-center checkShare" title="Share"
                                data-toggle="modal" data-target="#exampleModal">
                                <span class="fa fa-share-alt" aria-hidden="true"></span>
                                <input type="hidden" class="shareProductID" id="shareProductID${item}"
                                    value="${data.product_item[item].product_id}"/>
                            </a>

                            <!-- Modal -->
                            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog"
                                aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title" id="exampleModalLabel">Share</h4>
                                            <button type="button" class="close" data-dismiss="modal"
                                                aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">

                                            <form>
                                                <label class="mailLabel">Enter your Email here:</label>
                                                <input type="email" name="email" placeholder="Your email ID.."
                                                    class="email white form-control" id="email"
                                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required>
                                                <div class="valid-feedback feedback-pos">
                                                    Looks good!
                                                </div>
                                                <div class="invalid-feedback feedback-pos">
                                                    Please input valid email ID
                                                </div>

                                            </form>

                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-success sendEmail"
                                                >Submit</button>
                                            <button type="button" class="btn btn-secondary"
                                                data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                <a class="action-link add-to-cart w-100 text-center checkDelete deleteProduct" title="Delete">
                                <span class="fa fa-trash-o" aria-hidden="true"></span>
                                <input type="hidden" class="removeProductID" id="removeProductID${item}" value="${data.product_item[item].product_list_item_id}"/>
                                 
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

    },

    shareProduct: function () {
        $(document).on('click', '.checkShare', function (e) {
            var indexx = $(this).parent().parent().index();
            console.log(indexx);
            var shareProduct = $(`#shareProductID${indexx}`).val();
            $(`#shareProductId`).val(shareProduct);

            console.log(shareProduct);

        });

        $(document).on('click', '.sendEmail', function (e) {
            // var parentss = $(this).parent().parent().parent().parent().parent().parent();
            // console.log(parentss);
            // var indexx = parentss.index();
            // console.log(indexx);
            // console.log(this);
            // return;

            var productID = $(`#shareProductId`).val();
            console.log(productID);
            // var pID = $(`#shareProductID${productID}`).val();
            // console.log(pID);

            console.log("inside sharee");
            var shareProductUrl = $('#shareProductUrl').val();
            console.log(shareProductUrl);

            var getEmail = $('#email').val();
            var listOfEmails = getEmail;
            console.log(listOfEmails);

            $.ajax({
                url: shareProductUrl,
                type: 'post',
                context: this,
                data: { listOfEmails, productID },
                dataType: 'json',
                success: function (data) {
                    console.log("in success");
                    if (data.success) {
                        console.log("data sucesss");
                        console.log(data);
                    }

                },

                error: function (error) {
                    console.log("In error");
                    console.log(error);
                }
            });
        });



    },

    addToCartFromSpinningWheel: function () {
        $(document).on('click', '.checkAddtoCart', function () {
            console.log("true");
            var indexx = $(this).parent().parent().index();
            console.log(indexx);

            var addToCartUrl = $('#addToCartUrl').val();
            console.log(addToCartUrl);

            var pid = $(`#addToCartID${indexx}`).val();
            $(`#addToCartID`).val(pid);

            console.log(pid);

            var isComingFromSpinningWheel = true;

            // return;

            var form = {
                pid: pid,
                isComingFromSpinningWheel: isComingFromSpinningWheel

            };
           
            if (addToCartUrl) {
                $.ajax({
                    url: addToCartUrl,
                    method: 'POST',
                    data: form,
                    success: function (data) {
                        console.log(data);
                        console.log("in sucesss");
                        
                    },
                    error: function (error) {
                        console.log(error);
                        console.log("in error");
                       
                    }
                });
            }
        });
    },

    shareSpinningWheelPage: function () {
        $(document).on('click', '#shareBtn', function (e) {
            e.preventDefault();

            console.log("insidee shareWheelPage");

            var shareWheelPageURL = $('#shareWheelPageUrl').val();
            console.log(shareWheelPageURL);

            $(document).on('click', '.sharePage', function (e) {
                var email = $('#emailId').val();
                console.log(email);

                $.ajax({
                    url: shareWheelPageURL,
                    type: 'post',
                    data: { email },
                    dataType: 'json',
                    context: this,
                    success: function (data) {
                        console.log("in sucesss of sharePage");
                        if (data.success) {
                            $("#emailSuccess").text("Email sent successfully!");
                            $('#emailId').val('');
                            console.log("yeahh successs");
                            console.log(data);
                            setTimeout(function () {
                                $('#emailSuccess').fadeOut('fast');
                            }, 1000);

                        }
                        else {
                            $("#emailSuccess").text("Enter a valid email.");
                        }

                    },

                    error: function (error) {
                        console.log("Oops in error");
                        console.log(error);
                    }
                });
            });
        });

    }

}


