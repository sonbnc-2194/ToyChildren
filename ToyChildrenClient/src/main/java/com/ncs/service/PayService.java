package com.ncs.service;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import com.ncs.common.ResponseData;
import com.ncs.common.constants.Constants;
import com.ncs.model.dto.CartDto;
import com.ncs.model.entity.Coupon;
import com.ncs.model.entity.Customer;
import com.ncs.model.entity.Order;
import com.ncs.model.entity.OrderDetail;
import com.ncs.model.entity.Shipping;
import com.ncs.model.entity.Tax;
import com.ncs.model.input.PayInput;
import com.ncs.repository.CouponRepository;
import com.ncs.repository.CustomerRepository;
import com.ncs.repository.OrderDetailRepository;
import com.ncs.repository.OrderRepository;
import com.ncs.repository.ShippingRepository;
import com.ncs.repository.TaxRepository;

@Service
public class PayService {
	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private OrderDetailRepository orderDetailRepository;
	@Autowired
	private ShippingRepository shippingRepository;
	@Autowired
	private CouponRepository couponRepository;
	@Autowired
	private TaxRepository taxRepository;
	@Autowired
	private CustomerRepository customerRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(ProductService.class);
	private static final String COUPON_FILED = "Phiếu giảm giá";
	private static final String SHIPPING_FILED = "Hình thức giao hàng";
	private static final String TAX_FILED = "Thuế";

	@Transactional(rollbackOn = Exception.class)
	@SuppressWarnings("unchecked")
	public ResponseData<Object> pay(PayInput input, HttpServletRequest request) {
		LOGGER.info(">>>>>>>>>>>pay Start >>>>>>>>>>>>");
		ResponseData<Object> response = new ResponseData<Object>();
		try {
			Order order = new Order();
			Shipping shipping = new Shipping();
			Coupon coupon = new Coupon();
			Tax tax = new Tax();
			Customer customer = new Customer();
//			Account account = new Account();

//			CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
//					.getPrincipal();
			List<CartDto> carts = (List<CartDto>) request.getSession().getAttribute(Constants.CART_SESSION);
//			account = userDetails.getAccount();

			// get data input
			int shippingId = input.getShippingId();
			int couponId = input.getCouponId();
			int taxId = input.getTaxId();
			String payment = input.getPayment();

			// get data in db
			shipping = shippingRepository.findById(shippingId).orElse(null);
			coupon = couponRepository.findById(couponId).orElse(null);
			tax = taxRepository.findById(taxId).orElse(null);
//			customer = customerRepository.findByAccount(account);
			customer = customerRepository.findById(1).get(); // TODO

			// case carts null or empty
			if (ObjectUtils.isEmpty(carts)) {
				response.setCode(Constants.UNKNOWN_ERROR_CODE);
				response.setMessage(Constants.CART_EMPTY);
				return response;
			}

			// case shipping null or empty
			if (ObjectUtils.isEmpty(shipping)) {
				LOGGER.error("{} : {}", SHIPPING_FILED, Constants.RECORD_DO_NOT_EXIST);
				response.setCode(Constants.UNKNOWN_ERROR_CODE);
				response.setMessage(SHIPPING_FILED + " " + Constants.RECORD_DO_NOT_EXIST);
				return response;
			}

			// case coupon null or empty
			if (ObjectUtils.isEmpty(coupon)) {
				LOGGER.error("{} : {}", COUPON_FILED, Constants.RECORD_DO_NOT_EXIST);
				response.setCode(Constants.UNKNOWN_ERROR_CODE);
				response.setMessage(COUPON_FILED + " " + Constants.RECORD_DO_NOT_EXIST);
				return response;
			}

			// case tax null or empty
			if (ObjectUtils.isEmpty(tax)) {
				LOGGER.error("{} : {}", TAX_FILED, Constants.RECORD_DO_NOT_EXIST);
				response.setCode(Constants.UNKNOWN_ERROR_CODE);
				response.setMessage(TAX_FILED + " " + Constants.RECORD_DO_NOT_EXIST);
				return response;
			}

			// set data in order
			order.setCreateDate(new Date());
			order.setPayment(payment);
			order.setStatus(Constants.STATUS_ACTIVE_VALUE);
			order.setCoupon(coupon);
			order.setCustomer(customer);
			order.setShipping(shipping);
			order.setTax(tax);

			// save order in db
			order = orderRepository.save(order);

			// save cart in db
			for (CartDto cart : carts) {
				OrderDetail orderDetail = new OrderDetail();

				// set data in order detail
				orderDetail.setOrder(order);
				orderDetail.setProduct(cart.getProduct());
				orderDetail.setQuantity(cart.getQuantity());

				// save order detail in db
				orderDetailRepository.save(orderDetail);
				
				request.getSession().removeAttribute(Constants.CART_SESSION);
			}
		} catch (Exception e) {
			LOGGER.error("Api pay has exception : {}", e.getMessage());
			response.setCode(Constants.UNKNOWN_ERROR_CODE);
			response.setMessage(Constants.UNKNOWN_ERROR_MSG);
		}
		LOGGER.info(">>>>>>>>>>>pay End >>>>>>>>>>>>");
		return response;
	}
}