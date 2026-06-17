export default class FetchManager {
  constructor(props) {
    const { baseUrl, timeout } = props;
    if (baseUrl !== undefined) {
      this.baseUrl = baseUrl;
    }
    this.methods = ["GET", "POST", "PUT", "DELETE"];
    this.lastRequest = null;
    this.cacheEnabled = false;
    this.defaultHeaders = {};
    timeout ? (this.timeout = timeout) : (this.timeout = 10000);
  }

  async request(
    method,
    data,
    endpoint,
    onRequestSuccess,
    onRequestError,
    refetchOnError = false,
    requestOptions = {},
  ) {
    if (!this.methods.includes(method)) throw new Error("Invalid method");
    if (data && typeof data !== "object")
      throw new Error("Invalid data, not JSON");

    const controller = new AbortController();

    // SOLUCIÓN: Declaramos y tipamos 'options' correctamente desde el inicio.
    // Combinamos la lógica de headers en una sola asignación limpia.
    /** @type {RequestInit} */
    const options = {
      method: method,
      headers:
        method !== "GET"
          ? {
              "Content-Type": "application/json",
              ...this.defaultHeaders,
              ...requestOptions.headers,
            }
          : { ...this.defaultHeaders, ...requestOptions.headers },
      signal: controller.signal,
      credentials: "include", // Al estar tipado como RequestInit, 'include' es perfectamente válido
    };

    // Ya no necesitas el @ts-ignore, TypeScript sabe que 'body' existe en RequestInit
    if (data) {
      options.body = JSON.stringify(data);
    }

    let loading;
    if (!slice.controller.getComponent("Loading")) {
      loading = await slice.build("Loading", { sliceId: "Loading" });
    } else {
      loading = slice.controller.getComponent("Loading");
    }
    loading.start();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.timeout || 10000,
    );

    try {
      let response;

      if (
        this.cacheEnabled &&
        this.lastRequest &&
        this.lastRequest.endpoint === endpoint
      ) {
        loading.stop(); // Buenas prácticas: detén el loading si devuelves datos de caché
        return this.lastRequest.response;
      }

      if (this.baseUrl !== undefined) {
        response = await fetch(this.baseUrl + endpoint, options);
      } else {
        response = await fetch(endpoint, options);
      }

      if (response.ok) {
        if (typeof onRequestSuccess === "function") {
          onRequestSuccess(data, response);
        }
      } else {
        if (typeof onRequestError === "function") {
          onRequestError(data, response);
        }
        if (refetchOnError) {
          clearTimeout(timeoutId); // Limpiamos el timeout actual antes de reintentar
          return await this.request(
            method,
            data,
            endpoint,
            onRequestSuccess,
            onRequestError,
            refetchOnError,
            requestOptions,
          );
        }
      }

      let output = await response.json();
      loading.stop();

      if (this.cacheEnabled) {
        this.lastRequest = { data, response, endpoint };
      }

      return output;
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("La solicitud fue cancelada por tiempo límite (Timeout)");
      } else if (error.message === "Failed to fetch") {
        slice.logger.logError("Se perdió la conexión a internet");
      } else {
        console.error("Error al realizar la solicitud:", error);
      }
      loading.stop();
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  enableCache() {
    this.cacheEnabled = true;
  }

  disableCache() {
    this.cacheEnabled = false;
  }

  setDefaultHeaders(headers) {
    this.defaultHeaders = headers;
  }
}
