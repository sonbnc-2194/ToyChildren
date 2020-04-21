package com.ncs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ncs.common.ResponseData;
import com.ncs.model.entity.Product;
import com.ncs.model.output.GetListProductOutput;
import com.ncs.service.ProductService;

@RestController
@RequestMapping(value = "/api/v1/product/", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductRestController {
	@Autowired
	private ProductService productService;

	@GetMapping("list")
	public ResponseData<GetListProductOutput> getListProduct(@RequestParam(required = false) int page,
			@RequestParam(required = false) int size, @RequestParam(required = false) String search) {
		return productService.getListProducts(page, size, search);
	}

	@PreAuthorize("hasAnyRole('1')")
	@GetMapping("info/{id}")
	public ResponseData<Product> getListProduct(@PathVariable(name = "id") int productId) {
		return productService.getProductInfo(productId);
	}
}
