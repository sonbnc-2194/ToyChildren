package com.ncs.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ncs.common.ResponseData;
import com.ncs.model.entity.Product;
import com.ncs.model.input.ProductListInput;
import com.ncs.model.output.GetListProductOutput;
import com.ncs.serviceclient.ProductService;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping(value = "/product/", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class ProductRestController {
	@Autowired
	private ProductService productService;

	@GetMapping("list2")
	public ResponseData<GetListProductOutput> getListProducts(@ApiParam ProductListInput input) {
		return productService.getListProducts(input);
	}
	
	@GetMapping("list")
	public ResponseData<GetListProductOutput> getListProduct(@RequestParam int page, @RequestParam int size,
			@RequestParam(required = false) String search) {
		return productService.getListProducts(page, size, search);
	}

	@GetMapping("info/{id}")
	public ResponseData<Product> getListProduct(@PathVariable(name = "id") int productId) {
		return productService.getProductInfo(productId);
	}
	
	@GetMapping("new")
	public ResponseData<GetListProductOutput> getListProductNew(@RequestParam int page, @RequestParam int size) {
		return productService.getListProductsNew(page, size);
	}
	
	@GetMapping("hot")
	public ResponseData<List<Product>> getListProductHot() {
		return productService.getListProductsHot();
	}
}
